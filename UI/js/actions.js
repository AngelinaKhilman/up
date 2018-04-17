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
        if (!domModule.renderFeed(postsContainer, reload))
            domModule.disableElement({ id: 'load-more' });
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
        debugger;
        domModule.disableElementBy({ id: 'add-post-button' }, actions.addPost);
        domModule.renderAddPostForm(postsContainer);
    }

    function confirmAddPost() {
        alert('a');
    }

    function declineAddPost() {
        alert('a');
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
        confirmAddPost: confirmAddPost,
        declineAddPost: declineAddPost
    }
})();



window.onload = actions.init;