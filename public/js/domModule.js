var domModule = (function () {
    const TOP = 10;
    var currentSkip = 0;
    var userInfo = null;


    function element(type, className, text, attributes, events) {
        var elem = document.createElement(type);

        if (className) {
            elem.className = className;
        }

        if (text) {
            elem.innerText = text;
        }
        if (attributes)
            for (let attr in attributes)
                elem[attr] = attributes[attr];
        if (events)
            for (let event in events)
                elem.addEventListener(event, events[event]);

        return elem;
    }

    function renderAddPostForm(containerElement) {
        let newPostFormElement = element('div', 'post new-post');

        newPostFormElement.appendChild(element('i', 'fas fa-times', null,
            { id: 'decline-add-post-button' }, { click: actions.declineAddPost }));

        newPostFormElement.appendChild(element('input', 'search search-new-post', null,
            {
                id: 'add-post-photo',
                type: 'file',
                placeholder: 'Photo'
            }));

        newPostFormElement.appendChild(element('input', 'search search-new-post', null,
            {
                id: 'add-post-description',
                type: 'text',
                placeholder: 'Description'
            }));

        newPostFormElement.appendChild(element('button', null, 'Save',
            { id: 'confirm-add-post-button' }, { click: actions.confirmAddPost }));

        containerElement.insertBefore(newPostFormElement, containerElement.firstChild);
    }

    function renderEditPostForm(containerElement, data) {
        renderAddPostForm(containerElement);
        containerElement.firstChild.insertBefore(element('div', null, data.id, {
            id: 'current-edit',
        }), containerElement.firstChild.firstChild);
        document.getElementById('add-post-description').value = data.description;
        let confirmEditButton = document.getElementById('confirm-add-post-button');
        confirmEditButton.removeEventListener('click', actions.confirmAddPost);
        confirmEditButton.addEventListener('click', actions.confirmEditPost);
    }

    function getPostContainer() {
        return document.getElementsByClassName('post-container');
    }

    function renderUser(userContainer, user) {
        if (user) {
            userContainer.innerHTML = '';
            userContainer.appendChild(element('img', null, null,
                {
                    src: user.photo,
                    alt: user.login,
                    align: 'right'
                }));
            userContainer.appendChild(element('p', 'current-username', user.login));
            userContainer.appendChild(element('i', 'fas fa-sign-out-alt sign-out', null, null,
                { click: actions.signOut }));
            userInfo = user;
        }
    }

    function renderFeed(containerElement, reset) {
        if (reset)
            currentSkip = 0;
        let data = photoPostsModule.getPhotoPosts(currentSkip, TOP, {});
        currentSkip += TOP;

        for (let i = 0; i < data.length; i++)
            containerElement.appendChild(generatePostElement(data[i]));

        edits = containerElement.getElementsByClassName('fas fa-pencil-alt');
        for (let i = 0; i < edits.length; i++) {
            edits[i].addEventListener('click', actions.editPost);
            edits[i].nextSibling.addEventListener('click', actions.deletePost);
        }
        return data.length >= TOP;
    }

    function renderAddPostButton(containerElement, user) {
        if (user) {
            containerElement.appendChild(element('i', 'fas fa-plus', null,
                { id: 'add-post-button' }, { click: actions.addPost }));
        }
    }

    function generatePostElement(data) {
        if (typeof data === 'number')
            data = photoPostsModule.getPhotoPost(data);

        let containerElement = getPostContainer(),
            postElement = element('div', 'post', '', { id: data.id });

        function addHeader(postElement, data) {
            let author = element('p', 'author');
            let userAvatar = element('img', null, null,
                {
                    src: 'img/user_small.jpg',
                    align: 'center'
                });

            author.appendChild(userAvatar);
            author.innerHTML += data.author;
            postElement.appendChild(author);

            if (userInfo && userInfo.login === data.author) {
                let editPostContainer = element('div', 'edit-post');
                editPostContainer.appendChild(element('i', 'fas fa-pencil-alt'));
                editPostContainer.appendChild(element('i', 'fas fa-times'));
                postElement.appendChild(editPostContainer);
            }
        }

        function addImage(postElement, data) {
            let photoContainer = element('a');
            let image = element('img', 'photo-image', null, { src: data.photoLink });
            photoContainer.appendChild(image);

            postElement.appendChild(photoContainer);
        }

        function addFooter(postElement, data) {
            function addLikesBar(container) {
                container.appendChild(element('i', 'far fa-heart'));
            };

            let footer = element('div', 'post-footer');
            let likesBar = element('div', 'like-bar');
            addLikesBar(likesBar);
            footer.appendChild(likesBar);
            footer.appendChild(element('div', 'post-description', data.description));

            postElement.appendChild(footer);
        }

        addHeader(postElement, data);
        addImage(postElement, data);
        addFooter(postElement, data);

        return postElement;
    }

    function removePost(id) {
        let postContainer = getPostContainer();
        let postToRemove = postContainer.querySelector('#' + id);
        if (postToRemove != null && photoPostsModule.removePhotoPost(id)) {
            postToRemove.remove();
            return true;
        }
        return false;
    }

    function editPost(id, changes) {
        if (!photoPostsModule.editPhotoPost(id, changes))
            return false;
        let postContainer = getPostContainer();
        let postToEdit = postContainer.querySelector('#' + id);
        if (postToEdit == null)
            return false;
        postToEdit.innerText = generatePostElement(id).innerText;
        return true;
    }

    function disableElementBy(props, listener) {
        let element;
        if (props.hasOwnProperty('id'))
            element = document.getElementById(props.id);
        else if (props.hasOwnProperty('class'))
            element = document.getElementsByClass(props.class)[0];
        element.removeEventListener('click', listener);
        // element.setAttribute('disabled', 'disabled');
    }

    function enableElementBy(props, listener) {
        let element;
        if (props.hasOwnProperty('id'))
            element = document.getElementById(props.id);
        else if (props.hasOwnProperty('class'))
            element = document.getElementsByClass(props.class)[0];
        element.addEventListener('click', listener);
    }

    return {
        renderFeed: renderFeed,
        generatePostElement: generatePostElement,
        removePost: removePost,
        editPost: editPost,
        renderUser: renderUser,
        disableElementBy: disableElementBy,
        enableElementBy: enableElementBy,
        renderAddPostButton: renderAddPostButton,
        renderAddPostForm: renderAddPostForm,
        renderEditPostForm: renderEditPostForm,
    }
})();