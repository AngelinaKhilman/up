var actions = (function () {
    var user = null,
        storage,
        postsContainer,
        userContainer;

    function loadUser(userContainer) {
        if (!user) {
            let userStorageItem;
            if (!(userStorageItem = storage.getItem('user'))) {
                storage.setItem('user', 'null');
                userStorageItem = 'null';
            }
            if (userStorageItem != 'null')
                user = JSON.parse(userStorageItem);
        }
        var addPostButtonContainer = document.getElementsByClassName('add-post')[0];
        domModule.renderUser(userContainer, user);
        domModule.renderAddPostButton(addPostButtonContainer, user);
    }

    function loadPosts(postsContainer) {
        photoPostsModule.loadPosts(JSON.parse(sourceJSONPostsDataUniqueGlobalIdentifier));
        loadFeed();
    }

    function loadFeed(reload) {
        domModule.enableElementBy({ id: 'load-more-button' }, actions.loadMore);
        if (!domModule.renderFeed(postsContainer, reload))
            domModule.disableElementBy({ id: 'load-more-button' });
    }

    function loadMore() {
        loadFeed(false);
    }

    function authorize() {
        var login = document.getElementById('login-field').value;
        var password = document.getElementById('password-field').value;

        if (login == 'ang' && password == 'iloveup') {
            user = {
                login: 'ang',
                photo: 'img/user_small.jpg'
            };
            storage.setItem('user', JSON.stringify(user));
        }

        loadUser(userContainer);
        postsContainer.innerHTML = '';
        loadFeed(true);
    }

    function signOut() {
        storage.setItem('user', 'null');
        location.reload();
    }

    function addPost() {
        domModule.disableElementBy({ id: 'add-post-button' }, actions.addPost);
        domModule.renderAddPostForm(postsContainer);
    }

    function editPost(event) {
        let el = event.currentTarget;
        while ((el = el.parentElement) && !el.classList.contains('post'));
        domModule.renderEditPostForm(postsContainer, photoPostsModule.getPhotoPost(el.id));
    }

    function deletePost(event) {
        let el = event.currentTarget;
        while ((el = el.parentElement) && !el.classList.contains('post'));
        if (photoPostsModule.removePhotoPost(el.id))
            location.reload();
    }

    function confirmAddPost() {
        var image = 'img/photo1.JPG';
        var description = document.getElementById('add-post-description').value;
        if (photoPostsModule.addPhotoPost({
            description: description,
            createdAt: (new Date()).toISOString(),
            author: user.login,
            photoLink: image
        }))
            location.reload();
    }

    function confirmEditPost() {
        var image = 'img/photo1.JPG';
        var description = document.getElementById('add-post-description').value;
        var postId = document.getElementById('current-edit').innerText;
        if (photoPostsModule.editPhotoPost(postId, {
            description: description,
            createdAt: (new Date()).toISOString(),
            author: user.login,
            photoLink: image
        }))
            location.reload();
    }

    function declineAddPost() {
        document.getElementsByClassName('new-post')[0].remove();
        domModule.enableElementBy({ id: 'add-post-button' }, actions.addPost);
    }

    function init() {
        storage = window.localStorage;
        postsContainer = document.getElementsByClassName('post-container')[0];
        userContainer = document.getElementsByClassName('user-container')[0];

        loadUser(userContainer);
        loadPosts(postsContainer);
    }

    return {
        init: init,
        authorize: authorize,
        signOut: signOut,
        addPost: addPost,
        editPost: editPost,
        deletePost: deletePost,
        confirmAddPost: confirmAddPost,
        declineAddPost: declineAddPost,
        confirmEditPost: confirmEditPost,
        loadMore: loadMore
    }
})();



window.onload = actions.init;