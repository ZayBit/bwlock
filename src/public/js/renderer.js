const path = require('path');
// resolver rutas para acceder a los modulos
module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', '..', '..', 'src', 'public', 'js'));
module.paths.push(path.resolve('./resources', 'app', 'src', 'public', 'js'));
const fs = require('fs')
const os = require('os')
// const fsExtra = require('fs-extra')
const btnScan = document.getElementById('scan')
const btnReturnFiles = document.getElementById('returnFiles')
const confirmMs = document.querySelector('.confirm-ms')
const mainPath = `C:/Users/${os.userInfo().username}/AppData`
let mozillaPath = mainPath + '/Roaming/Mozilla/Firefox/Profiles/'
let chromePath = mainPath + '/Local/Google/Chrome/User Data/Default/'
let files_chrome = [
    'Cookies', // Todas las cookies
    'History', // Todo el historial
    'Bookmarks', // Todos los marcadores
    'Login Data', // Todas las contraseñas guardadas de los sitios web
    'Favicons'
]
let files_firefox = [
    'cookies.sqlite', // Todas las cookies
    'places.sqlite', // Marcadores, descargas e historial de navegación
]
let browserOption = document.getElementById('browser')
let webBrowser = 'chrome'
let filesPath = ''
let currentFiles = []
const acceptMS = (index)=>{
    // FIXME: PROBLEMA EN LA LONGITUD ( no siempre obteb )
    if(index == currentFiles.length-1){
        if(confirmMs.classList.contains('open-ms')){
            confirmMs.classList.remove('open-ms')
            setTimeout(()=>{
                confirmMs.classList.add('open-ms')
            },300)
        }else{
            confirmMs.classList.add('open-ms')
        }
    }
    confirmMs.querySelector('button').addEventListener('click',()=>{confirmMs.classList.remove('open-ms')})
}
const extracFiles = ()=>{
    fs.readdir(filesPath,(errFolders,folders)=>{
    let mainFolder = webBrowser == 'firefox' ? folders[1] : '';
    currentFiles.forEach((file,index)=>{
        let condition = webBrowser == 'chrome' && index == 0 ? '/Network/' : '/'
        if(fs.existsSync(`${filesPath}${mainFolder}${condition}${file}`)){
            fs.createReadStream(`${filesPath}${mainFolder}${condition}${file}`).pipe(fs.createWriteStream(`./resources/app/${webBrowser}/${file}`));
            fs.unlink(`${filesPath}${mainFolder}${condition}${file}`,()=>{
                console.log(`El archivo ${file} fue eliminado.`);
            })
            acceptMS(index)
        }
    })
})
}
let lightbox = document.querySelector('.lightbox')
btnScan.addEventListener('click',()=>{
    webBrowser = browserOption.value;
    if(webBrowser == 'chrome'){
        filesPath = chromePath;
        currentFiles = files_chrome
    }else if(webBrowser == 'firefox'){
        filesPath = mozillaPath;
        currentFiles = files_firefox
    }
    if(webBrowser != 'chrome' && webBrowser != 'firefox') return;
    if(fs.existsSync(`./resources/app/${webBrowser}/${currentFiles[0]}`)){
        lightbox.classList.add('lightbox-display')
        lightbox.addEventListener('click',(e)=>{
            if(e.target.classList.contains('btn-confirm')){
                extracFiles()
                lightbox.classList.remove('lightbox-display')
            }else if(e.target.classList.contains('btn-cancel')){
                lightbox.classList.remove('lightbox-display')
                return
            }
        })
    }else{
        extracFiles()
        lightbox.classList.remove('lightbox-display')
    }
})
btnReturnFiles.addEventListener('click',()=>{
    webBrowser = browserOption.value;
    if(webBrowser == 'chrome'){
        filesPath = chromePath;
        currentFiles = files_chrome
    }else if(webBrowser == 'firefox'){
        filesPath = mozillaPath;
        currentFiles = files_firefox
    }
    if(webBrowser != 'chrome' && webBrowser != 'firefox') return;
    if(!fs.existsSync(`./resources/app/${webBrowser}/${currentFiles[0]}`)) return;
    fs.readdir(filesPath,(errFolders,folders)=>{
        let mainFolder = webBrowser == 'firefox' ? folders[1] : '';
        currentFiles.forEach((file,index)=>{
            let condition = webBrowser == 'chrome' && index == 0 ? '/Network/' : '/'
            if(fs.existsSync(`./resources/app/${webBrowser}/${file}`)){
                fs.createReadStream(`./resources/app/${webBrowser}/${file}`).pipe(fs.createWriteStream(`${filesPath}${mainFolder}${condition}${file}`));
                fs.unlink(`./resources/app/${webBrowser}/${file}`,()=>{
                    console.log(`El archivo ${file} fue eliminado.`);
                })
                acceptMS(index)
            }
        })
    })
})
