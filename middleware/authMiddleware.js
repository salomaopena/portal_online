exports.isAuthenticated = (req, res, next) => {
    // Verifica se o usuário está autenticado (logado)
    // Se estiver, adiciona o usuário à requisição e chama o próximo middleware
    // Se não estiver, redireciona para a página de login
    if (req.session.user) {
        req.user = req.session.user; 
        return next();
    }
    return res.redirect("/login");  // Redireciona para a página de login se não estiver logado
};


exports.isValidURL = (req, res, next) => {
    if (req.session.user) {
        req.user = req.session.user; 
        return next();
    }
    return res.status(400).json({
        status: 400,
        error: 'Acesso negado!',
        message: 'Acesso negado! Não está autorizado.',
    }); 
};

//Apenas com acesso ao admin
exports.isAdmin = (permitedProfiles) =>{
    return (req, res, next) => {
        const user = req.session.user;
        if (!user || !permitedProfiles.includes(user.role)) {
            return res.status(403).render('acesso-negado'); // ou uma mensagem amigável
        }
        next();
    };
}


