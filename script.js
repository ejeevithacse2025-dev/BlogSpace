
/* ==============================
   CREATE BLOG MODAL
============================== */

.blog-modal {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(25, 15, 45, 0.65);
    z-index: 1000;
    justify-content: center;
    align-items: center;
    padding: 20px;
    overflow-y: auto;
}

.blog-modal.show-modal {
    display: flex;
}

.modal-content {
    width: 100%;
    max-width: 520px;
    background: white;
    padding: 30px;
    border-radius: 20px;
    position: relative;
    box-shadow: 0 15px 50px rgba(0,0,0,0.2);
}

.modal-content h2 {
    color: #6940a8;
    font-size: 25px;
    margin-bottom: 8px;
}

.modal-subtitle {
    color: #858092;
    font-size: 14px;
    margin-bottom: 22px;
}

.close-modal {
    position: absolute;
    right: 20px;
    top: 15px;
    border: none;
    background: none;
    font-size: 30px;
    color: #777;
}

#createBlogForm {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

#createBlogForm label {
    font-size: 14px;
    font-weight: 700;
    color: #393047;
    margin-top: 5px;
}

#createBlogForm input,
#createBlogForm select,
#createBlogForm textarea {
    width: 100%;
    padding: 13px;
    border: 1px solid #e3d9ef;
    border-radius: 10px;
    font-family: inherit;
    font-size: 14px;
    outline: none;
    background: #fcfaff;
}

#createBlogForm input:focus,
#createBlogForm select:focus,
#createBlogForm textarea:focus {
    border-color: #9569d0;
    box-shadow: 0 0 0 3px #eee5fc;
}

#createBlogForm textarea {
    resize: vertical;
}

.publish-btn {
    border: none;
    background: linear-gradient(90deg,#8658c7,#6840ad);
    color: white;
    padding: 14px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    margin-top: 10px;
}

.publish-btn:hover {
    background: #4e2d84;
}

@media (max-width: 520px) {
    .modal-content {
        padding: 23px;
    }
}
