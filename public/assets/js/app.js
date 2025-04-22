
document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault(); // Evita redirecionamento imediato

        Swal.fire({
            title: 'Deseja encerrar a sessão?',
            text: "Você será redirecionado para a página de login.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, encerrar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/admin/logout';
            }
        });
    });
});

