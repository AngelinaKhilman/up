let photoPostsModule = (function () {
    let postsData = null;



    const FIELDS_TO_FILTER = ['author', 'createdAt'];
    const ALL_FIELDS = ['id', 'description', 'createdAt', 'author', 'photoLink'];
    const EXPRESSIONS = {
        propertyExist: (object, property) => property.toString() in object,
        isTypeof: (object, type) => typeof (object) === type,
        checkNonEmpty: (value) => value.length > 0
    };

    function getPhotoPosts(skip = 0, top = 10, filterConfig = {}) {
        if (typeof skip === 'string')
            skip = parseInt(skip);
        if (typeof top === 'string')
            top = parseInt(top);

        loadPostsData();

        let array = postsData;

        function filter(array, field, filterConfig) {
            if (field in filterConfig) {
                array = array.filter(post => post[field] === filterConfig[field]);
            }
        }
        FIELDS_TO_FILTER.forEach(field => filter(array, field, filterConfig));

        return array.slice(skip, (skip + top));
    }

    function getPhotoPost(id) {
        if (typeof id === 'string')
            id = parseInt(id);

        loadPostsData();

        return postsData.find(post => post.id == id);
    };

    function validatePhotoPost(post) {
        loadPostsData();

        let fieldsToCheck = Object.keys(postsData[0]);

        // существование и типы
        if (!ALL_FIELDS.every(field => EXPRESSIONS.propertyExist(post, field)
            && EXPRESSIONS.isTypeof(post[field], 'string')))
            return false;

        // // уникальность ида
        // if (postsData.some(element => element.id === post.id))
        //     return false;

        //проверка непустых полей
        if (!EXPRESSIONS.checkNonEmpty(post.author) || !EXPRESSIONS.checkNonEmpty(post.photoLink))
            return false;

        //размер дескрипшена
        if (post.description.length >= 200)
            return false;

        return true;
    }

    function addPhotoPost(post) {
        loadPostsData();

        post.id = (parseInt(postsData[postsData.length - 1].id) + 1).toString();
        if (!validatePhotoPost(post))
            return false;

        if (postsData.length + 1 === postsData.push(post)) {
            synchronizeDatabase();
            return true;
        }
        return false;
    }

    function editPhotoPost(id, changes) {
        loadPostsData();

        let postToChange = postsData.find(post => post.id === id);
        if (postToChange != undefined) {
            changes.id = id.toString();
            changes.createdAt = postToChange.createdAt;
            changes.author = postToChange.author;
            changes.description = changes.description || postToChange.description;
            changes.photoLink = changes.photoLink || postToChange.photoLink;

            if (!validatePhotoPost(changes))
                return false;

            for (let property in postToChange) {
                postToChange[property] = changes[property];
            }

            synchronizeDatabase();
            return true;
        }
    }

    function removePhotoPost(id) {
        loadPostsData();

        let index = postsData.findIndex(post => post.id === id);
        if (index != -1) {
            postsData.splice(index, 1);
            synchronizeDatabase();
            return true;
        }
        return false;
    }

    function loadPosts(posts) {
        postsData = JSON.parse(window.localStorage.getItem('posts'));
        if (!postsData && posts)
            postsData = posts;
    }

    function loadPostsData() {
        if (!postsData) {
            const fs = require('fs');
            var path = require('path');
            postsData = JSON.parse(fs.readFileSync(__dirname + '/../../server/data/posts.json'));
        }
    }

    function synchronizeDatabase() {
        if (postsData) {
            const fs = require('fs');
            var path = require('path');
            fs.writeFile(__dirname + '/../../server/data/posts.json', JSON.stringify(postsData), (err) => {
                if (err) throw err;
            });
        }
        // window.localStorage.setItem('posts', JSON.stringify(postsData));
    }


    return {
        getPhotoPost: getPhotoPost,
        getPhotoPosts: getPhotoPosts,
        validatePhotoPost: validatePhotoPost,
        addPhotoPost: addPhotoPost,
        editPhotoPost: editPhotoPost,
        removePhotoPost: removePhotoPost,
        loadPosts: loadPosts
    }
}());



module.exports = photoPostsModule;