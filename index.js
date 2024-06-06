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

    if (selectCategory.length === 0)
        return res.status(404).json({
            ok: false,
            error: "404 Not found",
            msg: "categoria no encontrada",
        });

    res.json(findCategory(categoria));
});

const filterCategory = (joya, fields) => {
    for (let prop in joya) {
        if (!fields.includes(prop)) delete joya[prop];
    }
    return joya;
};

const joya = (id) => {
    return joyas.find((item) => item.id === +id);
};

app.get("/joyas/:id", (req, res) => {
    const { id } = req.params;

    if (!joya(id))
        return res.status(404).json({
            ok: false,
            error: "404 Not found",
            msg: "Joya no encontrada",
        });

    return res.send(joya(id));
});

app.get("/joyas/cat/:id", (req, res) => {
    const { id } = req.params;
    const { fields } = req.query;

    if (fields) {
        return res.send({
            joya: filterCategory(joya(id), fields.split(",")),
        });
    } else {
        return res.status(404).json({
            ok: false,
            error: "404 Not found",
            msg: "Joya no encontrada",
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
