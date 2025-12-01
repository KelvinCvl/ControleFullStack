const ServiceHistoire = require("../services/ServiceHistoire");

// 📌 GET /histoire/mine
exports.getMine = async (req, res) => {
    try {
        const auteurId = req.user.id;
        const [histoires] = await ServiceHistoire.getMine(auteurId);
        res.json(histoires);
    } catch (error) {
        console.error("Erreur getMine :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des histoires" });
    }
};

// 📌 GET /histoire/publiques
exports.getAllPubliques = async (req, res) => {
    try {
        const [histoires] = await ServiceHistoire.getAllPubliques();
        res.json(histoires);
    } catch (error) {
        console.error("Erreur getAllPubliques :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des histoires publiées" });
    }
};

// 📌 GET /histoire/publiques/theme/:theme
exports.getByTheme = async (req, res) => {
    try {
        const { theme } = req.params;
        const [histoires] = await ServiceHistoire.getAllPubliquesByTheme(theme);
        res.json(histoires);
    } catch (error) {
        console.error("Erreur getByTheme :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des histoires" });
    }
};

// 📌 GET /histoire/themes
exports.getAllThemes = async (req, res) => {
    try {
        const [themes] = await ServiceHistoire.getAllThemes();
        res.json(themes);
    } catch (error) {
        console.error("Erreur getAllThemes :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des thèmes" });
    }
};

// 📌 POST /histoire
exports.create = async (req, res) => {
    try {
        const data = {
            titre: req.body.titre,
            description: req.body.description,
            statut: req.body.statut || "brouillon",
            pagedepart_id: req.body.pagedepart_id || null,
            auteur_id: req.user.id,
            theme: req.body.theme || null
        };

        const result = await ServiceHistoire.create(data);
        res.json({ message: "Histoire créée", id: result.insertId });

    } catch (error) {
        console.error("Erreur create :", error);
        res.status(500).json({ error: "Impossible de créer l'histoire" });
    }
};

// 📌 GET /histoire/:id
exports.getById = async (req, res) => {
    try {
        const [histoire] = await ServiceHistoire.getById(req.params.id);
        if (!histoire.length) {
            return res.status(404).json({ error: "Histoire non trouvée" });
        }
        res.json(histoire[0]);
    } catch (error) {
        console.error("Erreur getById :", error);
        res.status(500).json({ error: "Erreur lors de la récupération de l'histoire" });
    }
};

// 📌 PUT /histoire/:id
exports.update = async (req, res) => {
    try {
        const data = {
            titre: req.body.titre || "",
            description: req.body.description || "",
            statut: req.body.statut || "brouillon",
            pagedepart_id: req.body.pagedepart_id || null,
            theme: req.body.theme || null
        };

        await ServiceHistoire.update(req.params.id, data);
        res.json({ message: "Histoire mise à jour" });
    } catch (error) {
        console.error("Erreur update :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
};

// 📌 DELETE /histoire/:id
exports.delete = async (req, res) => {
    try {
        await ServiceHistoire.delete(req.params.id);
        res.json({ message: "Histoire supprimée" });
    } catch (error) {
        console.error("Erreur delete :", error);
        res.status(500).json({ error: "Erreur lors de la suppression" });
    }
};

// 📌 GET /histoire/:id/debut (PUBLIC)
exports.getDebutPublic = async (req, res) => {
    try {
        const [result] = await ServiceHistoire.getDebutPublic(req.params.id);
        if (!result.length) {
            return res.status(404).json({ error: "Histoire non trouvée ou non publiée" });
        }

        const data = result[0];
        const histoire = {
            id: data.id,
            titre: data.titre,
            description: data.description,
            theme: data.theme,
            auteur: data.auteur
        };

        // Si pas de page de départ, retourner null pour page
        const page = data.page_id ? {
            id: data.page_id,
            contenu: data.contenu,
            isEnd: data.isEnd
        } : null;

        res.json({ histoire, page });
    } catch (error) {
        console.error("Erreur getDebutPublic :", error);
        res.status(500).json({ error: "Erreur lors de la récupération" });
    }
};

