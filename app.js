const express = require('express');
const processor = require('./public/js/photoPostsModule.js');
const app = express();

app.use(express.static('public'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/getPhotoPost', (req, res) => {
    let post = processor.getPhotoPost(req.query.id);
    if (!post)
        res.status(404).end("Пост не найден");
    else
        res.end(JSON.stringify(post));
});

app.post("/getPhotoPosts", (req, res) => {
    let posts = processor.getPhotoPosts(req.query.skip, req.query.top, req.body);

    if (posts.length === 0)
        res.status(404).end("Постов по вашему запросу не найдено");
    else
        res.end(JSON.stringify(posts));
});

app.post("/addPhotoPost", (req, res) => {
    let result = processor.addPhotoPost(req.body);
    if (!result)
        res.status(400).end("Неверный формат поста");
    else
        res.end("Пост добавлен");
});

app.put("/editPhotoPost", (req, res) => {
    let result = processor.editPhotoPost(req.query.id, req.body);
    if (!result)
        res.status(400).end("Неверный формат изменений");
    else
        res.end("Пост изменён");
});

app.delete("/removePhotoPost", (req, res) => {
    if (!processor.removePhotoPost(req.query.id))
        res.status(404).end("Пост не найден");
    else
        res.end("Пост удалён");
});





app.listen(3000, () => {
    console.log('Server is running...');
});