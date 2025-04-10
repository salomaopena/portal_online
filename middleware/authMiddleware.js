
exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        req.user = req.session.user; 
        return next();
    }
    return res.redirect("/login");  // Redireciona para a página de login se não estiver logado
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