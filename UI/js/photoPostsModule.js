
let photoPostsModule = (function () {
    let postsData = [
        {
            id: '1',
            description: 'Это пост 1',
            createdAt: new Date('2018-03-03T20:11:31'),
            author: 'author1',
            photoLink: 'img/photo1.JPG',
        },
        {
            id: '2',
            description: 'Это пост 2',
            createdAt: new Date('2018-03-03T19:01:56'),
            author: 'author2',
            photoLink: 'img/photo1.JPG',
        }
    ];

    const FIELDS_TO_FILTER = ['author', 'createdAt'];
    const ALL_FIELDS = ['id', 'description', 'createdAt', 'author', 'photoLink'];
    const EXPRESSIONS = {
        propertyExist: (object, property) => property.toString() in object,
        isTypeof: (object, type) => typeof (object) === type,
        checkNonEmpty: (value) => value.length > 0
    };

    function getPhotoPosts(skip = 0, top = 10, filterConfig = {}) {
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
        return postsData.find(post => post.id == id);
    };

    function validatePhotoPost(post) {

        let fieldsToCheck = Object.keys(postsData[0]);


        // существование и типы
        var allFieldWithoutDate = ALL_FIELDS.filter(obj => obj !== 'createdAt');
        if (
            !allFieldWithoutDate.every(field => EXPRESSIONS.propertyExist(post, field)
                && EXPRESSIONS.isTypeof(post[field], 'string'))
            || (!EXPRESSIONS.propertyExist(post, 'createdAt') || !EXPRESSIONS.isTypeof(post.createdAt, 'Date'))
        )
            return false;

        // уникальность ида
        if (postsData.some(element => element.id === post.id))
            return false;

        //проверка непустых полей
        if (!EXPRESSIONS.checkNonEmpty(post.author) || !EXPRESSIONS.checkNonEmpty(post.photoLink))
            return false;

        //размер дескрипшена
        if (post.description.length >= 200)
            return false;

        return true;
    }

    function addPhotoPost(post) {
        if (!validatePhotoPost(post))
            return false;
        return postsData.length + 1 === postsData.push(post);
    }

    function editPhotoPost(id, changes) {
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
            return true;
        }
    }

    function removePhotoPost(id) {
        let index = postsData.findIndex(post => post.id === id);
        if (index != -1) {
            postsData.splice(index, 1);
            return true;
        }
        return false;
    }

    return {
        getPhotoPost: getPhotoPost,
        getPhotoPosts: getPhotoPosts,
        validatePhotoPost: validatePhotoPost,
        addPhotoPost: addPhotoPost,
        editPhotoPost: editPhotoPost,
        removePhotoPost: removePhotoPost
    }
}());