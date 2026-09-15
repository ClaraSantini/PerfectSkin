// Cette fonction tourne sur le serveur (jamais dans le navigateur du patient).
// La clé API reste donc secrète : elle est lue depuis une variable d'environnement
// configurée sur Vercel (ANTHROPIC_API_KEY), jamais écrite dans ce fichier ni envoyée au navigateur.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Clé API non configurée côté serveur (variable ANTHROPIC_API_KEY manquante)." });
  }

  try {
    const { image, mediaType, profile = {} } = req.body || {};
    if (!image || !mediaType) {
      return res.status(400).json({ error: 'Photo manquante ou format non reconnu.' });
    }

    const allowedKeys = ['hydratation', 'pores', 'rides', 'cernes', 'imperfections', 'sensibilite', 'teint'];

    const prompt = `Tu es un outil d'aide au conseil cosmétique en pharmacie (PAS un outil médical, pas de diagnostic).
Observe la photo de visage fournie et évalue uniquement des caractéristiques cosmétiques visibles de la peau.

Contexte déclaré par la personne : type de peau=${profile.type || 'non précisé'}, tranche d'âge=${profile.age || 'non précisée'}, préoccupation principale=${profile.concern || 'non précisée'}.

Réponds UNIQUEMENT avec un JSON valide, sans texte autour, sans balises markdown, au format exact :
{"issues":[{"key":"<une des valeurs: ${allowedKeys.join(', ')}>","level":"Léger|Modéré|Marqué"}],"skin_age_estimate":<entier>}

Choisis entre 2 et 4 "issues" les plus visibles. Ne mentionne rien d'autre. Ne fais aucune affirmation médicale ou diagnostique, reste sur des caractéristiques cosmétiques visibles (hydratation apparente, brillance, texture, rougeurs visibles, relâchement, cernes visibles).`;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: image } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    if (!anthropicResponse.ok) {
      const detail = await anthropicResponse.text();
      console.error('Erreur API Anthropic:', detail);
      return res.status(502).json({ error: "L'analyse IA a échoué. Réessaie dans un instant." });
    }

    const data = await anthropicResponse.json();
    const textBlock = (data.content || []).find(b => b.type === 'text');
    if (!textBlock) {
      return res.status(502).json({ error: "Réponse IA vide ou inattendue." });
    }

    const cleaned = textBlock.text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Erreur serveur /api/analyze:', err);
    return res.status(500).json({ error: "Erreur serveur pendant l'analyse." });
  }
}
