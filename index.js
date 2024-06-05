import express from "express";
import joyas from "./database/joyas.js";

const app = express();

const hateoas = (joyas) => {
    return joyas.map((item) => {
        return {
            nombre: item.name,
            href: `http://localhost:3000/joyas/${item.id}`,
        };
    });
};

app.get("/joyas", (req, res) => {
    res.send({
        joyas: hateoas(joyas),
    });
});

const findCategory = (categoria) => {
    return joyas.filter((item) => item.category === categoria);
};

app.get("/joyas/categoria/:categoria", (req, res) => {
    const { categoria } = req.params;

    const selectCategory = findCategory(categoria);

    if (selectCategory.length === 0) return res.json({ ok: false, msg: "categoria no encontrada" });

    res.json(findCategory(categoria));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
