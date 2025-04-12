document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('password').value;

            const result = await loginUser(email, senha);

            if (result.error) {
                showAlert(result.error, "error");
            } else {
                showAlert(result.message, "success");
                setTimeout(() => {
                    window.location.href = "/admin";
                }, 2000);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const first_name = document.getElementById('first_name').value;
            const last_name = document.getElementById('last_name').value;
            const email = document.getElementById('email').value;
            const passwd = document.getElementById('password').value;

            const result = await registerUser(first_name, last_name, email, passwd);

            if (result.error) {
                showAlert(result.error, "error");
            } else {
                showAlert(result.message, "success");
                setTimeout(() => {
                    window.location.href = "/admin";
                }, 2000);
            }
        });
    }
});


function showAlert(message, type = "success") {
    Swal.fire({
        title: type === "success" ? "Sucesso!" : "Erro!",
        text: message,
        icon: type,
        confirmButtonText: "OK",
        timer: 3000,
        showConfirmButton: false
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();

            Swal.fire({
                title: "Tem certeza?",
                text: "Você será desconectado do sistema.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sim, sair!",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch("/api/logout")
                        .then(response => response.json())
                        .then(data => {
                            Swal.fire("Até logo!", data.message, "success");
                            setTimeout(() => {
                                window.location.href = "/login";
                            }, 1500);
                        })
                        .catch(error => Swal.fire("Erro!", "Não foi possível encerrar a sessão", "error"));
                }
            });
        });
    }
});



/************************************************************************ */
/** CATEGORIA*/
/**************************************************************************/
async function deleteCategory(id) {
    const result = await Swal.fire({
        title: "Tem certeza?",
        text: "A categoria será excluída e não poderá ser utilizada no sistema!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(`/admin/categories/delete/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire("Excluída!", data.message, "success");
                document.getElementById(`category-${id}`).remove(); // Remove da tabela
            } else {
                Swal.fire("Erro!", data.message, "error");
            }
        } catch (error) {
            Swal.fire("Erro!", "Falha ao comunicar com o servidor.", "error");
        }
    }
}

/** Add category */

function openAddUserModal() {
    let modal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
    modal.show();
}

document.getElementById("addCategoryForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const slug = document.getElementById("slug").value;

    try {
        const response = await axios.post("/admin/categories/add", { name, slug });

        Swal.fire({
            title: "Sucesso!",
            text: response.data.message,
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });

        setTimeout(() => {
            window.location.reload(); // Atualiza a página para exibir a nova categoria
        }, 2000);

    } catch (error) {
        console.error("Erro ao adicionar categoria:", error);
        Swal.fire("Erro!", "Não foi possível adicionar a categoria.", "error");
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const categoryNameInput = document.getElementById("name");
    const categorySlugInput = document.getElementById("slug");

    categoryNameInput.addEventListener("input", function () {
        let slug = categoryNameInput.value
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/\s+/g, "-") // Substitui espaços por hífens
            .replace(/[^a-z0-9-]/g, "") // Remove caracteres especiais
            .replace(/-+/g, "-") // Substitui múltiplos hífens por um único
            .trim();

        categorySlugInput.value = slug;
    });
});



function openEditCategoryModal(id, name, slug) {
    document.getElementById("edit_id").value = id;
    document.getElementById("edit_name").value = name;
    document.getElementById("edit_slug").value = slug;

    let modal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
    modal.show();
}

document.getElementById("editCategoryForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("edit_id").value;
    const name = document.getElementById("edit_name").value;
    const slug = document.getElementById("edit_slug").value;

    try {
        const response = await axios.put(`/admin/categories/update/${id}`, { name, slug });

        Swal.fire({
            title: "Sucesso!",
            text: response.data.message,
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });

        setTimeout(() => {
            window.location.reload(); // Atualiza a página para refletir os dados editados
        }, 2000);

    } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
        Swal.fire("Erro!", "Não foi possível atualizar o categoria.", "error");
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const categoryNameInput = document.getElementById("edit_name");
    const categorySlugInput = document.getElementById("edit_slug");

    categoryNameInput.addEventListener("input", function () {
        let slug = categoryNameInput.value
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
            .replace(/\s+/g, "-") // Substitui espaços por hífens
            .replace(/[^a-z0-9-]/g, "") // Remove caracteres especiais
            .replace(/-+/g, "-") // Substitui múltiplos hífens por um único
            .trim();

        categorySlugInput.value = slug;
    });
});



