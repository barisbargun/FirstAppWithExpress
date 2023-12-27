// http kullanılacaksa secure false yapılır aksi takdirde çalışmaz.
// maxAge 1 gündür.

const makeJWTCookie = (res, refreshToken) => {
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 });
}

const clearJWTCookie = (res) => {
    // önbellekteki jwt anahtarını temizler. Ek ayarlar gereklidir.
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false });
}

module.exports = {makeJWTCookie, clearJWTCookie};