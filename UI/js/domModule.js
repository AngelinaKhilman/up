var domModule = (function () {
    const TOP = 10;
    var user = 'angelinakhilman';


    function element(type, className, text, attributes) {
        var elem = document.createElement(type);
        elem.className = className;

        if (text) {
            elem.innerText = text;
        }
        if (attributes)
            for (let attr in attributes)
                elem[attr] = attributes[attr];

        return elem;
    }

    function getPostContainer() {
        return document.getElementsByClassName('post-container');
    }

    function renderUser() {
        if (user != null)
            document.getElementsByClassName('current-username').innerText = user;
    }

    function renderFeed() {
        let data = photoPostsModule.getPhotoPosts(0, TOP, {});
        if (data.type === 'success')
            data = data.posts;

        for (let i = 0; i < TOP; i++)
            containerElement.insertBefore(generatePostElement(data[i]), containerElement.children[1]);
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

            if (user === data.author) {
                let editPostContainer = element('div', 'edit-post');
                container.appendChild(element('i', 'fas fa-pencil-alt'));
                container.appendChild(element('i', 'fas fa-times'));
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

    return {
        renderFeed: renderFeed,
        generatePostElement: generatePostElement,
        removePost: removePost,
        editPost: editPost,
        renderUser
    }
})();

window.onload = function (e) {
    debugger;
    let container = document.getElementsByClassName('post-container')[0];
    container.insertBefore(domModule.generatePostElement(1), container.children[1]);
};