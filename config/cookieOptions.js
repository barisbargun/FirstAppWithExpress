// http kullanılacaksa secure false yapılır aksi takdirde çalışmaz.
// maxAge 1 gündür.

const makeJWTCookie = (res, refreshToken) => {
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure:true,  maxAge: 24 * 60 * 60 * 1000 });
}

const clearJWTCookie = (res) => {
    // önbellekteki jwt anahtarını temizler. Ek ayarlar gereklidir.
    res.clearCookie('jwt', { httpOnly: true, secure:true, sameSite: 'None' });
}

module.exports = {makeJWTCookie, clearJWTCookie};