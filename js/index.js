// service worker pour le PWA
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log(registration);
    }).catch((error)=> {
        console.log("SW Registration Failed!");
        console.log(error);
    });
}

// list de tout les persos dans l ordre
const listeperso = ['Clara Garcia', 'Juan Cortez', 'Diego Castillo', 'Antón Castillo', 'Dani Rojas'];

function ajouter() { // ajouter un personnage dans le session storage
    const perso = document.getElementById("selectperso").value;
    const niveau = document.getElementById("selectniveau").value;

    if (perso.length == 1 && niveau.length == 1) { // si les deux infos sont preciser
        if (!localStorage.getItem("personnages")) { // creer le tableau avec le nouveau perso
            value = [{ "id": 1, "perso": perso, "niveau": niveau }];
            localStorage.setItem("personnages", JSON.stringify(value));
        } else { // ajouter le perso au tableau
            value = JSON.parse(localStorage.getItem("personnages"))
            // on utilise le spread pour ajouter le nouvel élément à l'ancien tableau
            value = [...value, { "id": JSON.parse(localStorage.getItem("personnages"))[JSON.parse(localStorage.getItem("personnages")).length - 1].id + 1, "perso": perso, "niveau": niveau }]
            localStorage.setItem("personnages", JSON.stringify(value));
        }

        const err = document.getElementById('error');
        err.innerHTML = ""; // reinitialiser le message d'erreur

        sessionStorage.setItem("selecteur", JSON.stringify({ // mettre les dernieres options choisies
            perso: perso,
            niveau: niveau
        }));
        selecteurDefaut(); // actualiser les options du selecteur
    } else { // afficher l'erreur
        const err = document.getElementById('error');
        err.innerHTML = "Veuillez rentrer toutes les informations pour ajouter un personnage";
    }

    montrerPerso(); // actualiser la liste des persos
}

function montrerPerso() { // afficher tout les personnages du session storage
    const container = document.getElementById("container"); // actualiser la div container

    // mettre la card de creation en premier
    container.innerHTML = `<div class="card">
        <div class="box">
            <div class="content">
                <h3>Créez votre Personnages</h3>
                <label>
                    <select id="selectperso">
                        <option value="">Choisissez un personnage</option>
                        <option id="option1" value="1">Clara Garcia</option>
                        <option id="option2" value="2">Juan Cortez</option>
                        <option id="option3" value="3">Diego Castillo</option>
                        <option id="option4" value="4">Antón Castillo</option>
                        <option id="option5" value="5">Dani Rojas</option>
                    </select>
                </label>
                <label>
                    <select id="selectniveau">
                        <option value="">Choisissez le niveau du personnage</option>
                        <option id="optionniveau1" value="1">Niv. 1</option>
                        <option id="optionniveau2" value="2">Niv. 2</option>
                        <option id="optionniveau3" value="3">Niv. 3</option>
                        <option id="optionniveau4" value="4">Niv. 4</option>
                        <option id="optionniveau5" value="5">Niv. 5</option>
                    </select>
                </label>
                <a href="#" onclick="ajouter()">Ajouter</a>
            </div>
        </div>
    </div>`;

    if (localStorage.getItem("personnages")) { // si il y a au moins un perso -> les afficher
        const persotab = JSON.parse(localStorage.getItem("personnages"))

        persotab.forEach(element => { // boucle pour chaque perso
            container.innerHTML += `<div class="card card${element.perso}" id="card${element.id}">
                <div class="box">
                    <div class="content">
                        <h3>${listeperso[parseInt(element.perso)-1]}</h3>
                        <p>Niveau ${element.niveau}</p>
                        <div class="horizonlign">
                            <a class="editbouton" onclick="changerPerso('${element.id}', ${element.perso}, ${element.niveau})">Editer</a>
                            <a class="suppbouton" onclick="supprimerPerso('${element.id}')">Supprimer</a>
                        </div>
                    </div>
                </div>
            </div>`
        });
    }

    selecteurDefaut() // actualiser les options du selecteur
}

function supprimerPerso(id) { // supprimer le perso dans le local storage
    const persotab = JSON.parse(localStorage.getItem("personnages"))

    persotab.forEach((element, index) => {
        if (element.id == id) {
            persotab.splice(index, 1); // supprime le perso du tableau
        }
    });

    localStorage.setItem("personnages", JSON.stringify(persotab)); // enregistre le nouveau tableau
    montrerPerso();
    selecteurDefaut(); // actualiser les options du selecteur
}

function changerPerso(id, perso, niv) { // afficher les options pour editer le personnage
    const div = document.getElementById(`card${id}`);

    div.innerHTML = `
    <div class="box">
    <div class="content">
    <h3>Editez votre personnage</h3>
    <label>
        <select id="selectperso${id}">
            <option ${perso == 1 ? "selected" : ""} value="1">Clara Garcia</option>
            <option ${perso == 2 ? "selected" : ""} value="2">Juan Cortez</option>
            <option ${perso == 3 ? "selected" : ""} value="3">Diego Castillo</option>
            <option ${perso == 4 ? "selected" : ""} value="4">Antón Castillo</option>
            <option ${perso == 5 ? "selected" : ""} value="5">Dani Rojas</option>
        </select>
    </label>
    <label>
        <select id="selectniveau${id}">
            <option ${niv == 1 ? "selected" : ""} value="1">Niv. 1</option>
            <option ${niv == 2 ? "selected" : ""} value="2">Niv. 2</option>
            <option ${niv == 3 ? "selected" : ""} value="3">Niv. 3</option>
            <option ${niv == 4 ? "selected" : ""} value="4">Niv. 4</option>
            <option ${niv == 5 ? "selected" : ""} value="5">Niv. 5</option>
        </select>
    </label>
    <a href="#" onclick="changerPersoStorage(${id})">Editer</a>
    </div>
    </div>`
}

function changerPersoStorage(id) { // editer le personnage dans le local storage
    const perso = document.getElementById(`selectperso${id}`).value;
    const niveau = document.getElementById(`selectniveau${id}`).value;
    const persotab = JSON.parse(localStorage.getItem("personnages"));

    persotab.forEach((element, index) => {
        if (element.id == id) {
            let info = [element.perso, perso, element.niveau, niveau];
            sessionStorage.setItem("edit", JSON.stringify(info))
            persotab[index] = { // remplacer les infos du perso
                id: id,
                perso: perso,
                niveau: niveau
            }
        }
    })

    localStorage.setItem("personnages", JSON.stringify(persotab)); // enregistre le nouveau tableau
    montrerPerso(); // actualiser l'affichage
    afficherinfo(); // actualiser le message d'info
}

function selecteurDefaut() { // mettre l'option par defaut du selecteur qui est enregistré dans le session storage
    if (sessionStorage.getItem("selecteur")) {
        document.getElementById(`option${JSON.parse(sessionStorage.getItem("selecteur")).perso}`).selected = true;
        document.getElementById(`optionniveau${JSON.parse(sessionStorage.getItem("selecteur")).niveau}`).selected = true;
    }
}

function devicememory () { // afficher la memoire restante
    document.getElementById('result').innerHTML = navigator.deviceMemory ?? 'unknown'
    setTimeout(() => {
        document.getElementById('result').innerHTML = navigator.deviceMemory ?? 'unknown'
    }, 10000);
}

function afficherinfo () { // afficher le texte info si il y a une info a afficher
    if (sessionStorage.getItem("edit")) {
        const editinfo = JSON.parse(sessionStorage.getItem("edit"));
        const info = document.getElementById("info");
        info.innerHTML = "";
        if (editinfo[0] != editinfo[1]) { // si le perso a changé
            info.innerHTML += "Le personnage " + listeperso[editinfo[0]-1] + " est devenu " + listeperso[editinfo[1]-1] + ". ";
        }
        if (editinfo[2] != editinfo[3]) { // si le niveau a changé
            info.innerHTML += "Le niveau " + editinfo[2] + " du personnage est maitenant " + editinfo[3] + ". ";
        }

        sessionStorage.removeItem("edit"); // enlever l'info pour supprimer le message au reload de la page
    } else {
        const info = document.getElementById("info");
        info.innerHTML = '';
    }
}

document.addEventListener("DOMContentLoaded", async() => {
    // executer les fonctions des que le dom est chargé
    montrerPerso()
    selecteurDefaut()
    devicememory()
    afficherinfo()
})