 const adminAuth = (req, res, next) => {
    console.log('admin auth is gettng checked...');
    const token = 'abc'
    const isAdminAuthorized = token === 'abc';
    if (isAdminAuthorized) {
        res.status(401).send('Unauthorized req')
    } else {
        next();
    }
    
}

const userAuth = (req, res, next) => {
    console.log('user auth is gettng checked...');
    const token = 'abccc'
    const isAdminAuthorized = token === 'abccc';
    if (isAdminAuthorized) {
        res.status(401).send('Unauthorized req')
    } else {
        next();
    }

}

module.exports = 
    {adminAuth, userAuth}