let Cookies = require('js-cookie');

function signOut() {
    Cookies.remove('xmlQueryToken')
    localStorage.removeItem('userName')
    window.location.reload()
}

function merge(arr1, arr2) {
    let flags = {};
    let newArr = [...arr1, ...arr2].filter(function (entry) {
        if (flags[entry.name]) {
            return false;
        }
        flags[entry.name] = true;
        return true;
    });
    return newArr
}

function clearFilters() {
    window.location.reload()
}

export {
    signOut, merge, clearFilters
}
