import { Scene, Act, Play } from './play-module.js';

document.addEventListener("DOMContentLoaded", function () {
   const playListSelector = document.querySelector('#playList');
   const playGenerater = document.querySelector('#playHere');
   const actSection = document.querySelector('#actList');
   const sceneSection = document.querySelector('#sceneList');
   const playerList = document.querySelector('#playerList');
   const allPlayers = document.querySelector('#playerList option');
   const filterButton = document.querySelector('#btnHighlight');
   const keyWordInput = document.querySelector('#txtHighlight');
   let playDataGlobal;
   let selectedPlay = '';

   // Add an event listener for the "change" event
   playListSelector.addEventListener('change', function () {
      // Get the selected value when the "change" event occurs
      selectedPlay = playListSelector.value;
      const url = 'https://www.randyconnolly.com//funwebdev/3rd/api/shakespeare/play.php';
      keyWordInput.value = '';
      /*
        To get a specific play, add play name via query string,  
         e.g., url = url + '?name=hamlet';
       
       https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=hamlet
       https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=jcaesar
        
      */
      const fetchUrl = `${url}?name=${selectedPlay}`;
      fetch(fetchUrl)
         .then(response => {
            // Check if the request was successful 
            if (!response.ok) {
               throw new Error(`Error: ${response.status}`);
            }
            // Parse the JSON response and return it
            return response.json();
         })
         .then(data => {
            changePlayElement(data);
         })
         .catch(error => {
            // Handle errors during the fetch process
            console.error(`Fetch error: ${error.message}`);
         });
   })
   /* note: you may get a CORS error if you test this locally (i.e., directly from a
      local file). To work correctly, this needs to be tested on a local web server.  
      Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
      use built-in Live Preview.
   */
   async function changePlayElement(data) {
      playDataGlobal = data;
      actSection.textContent = '';

      for (let Act of playDataGlobal.acts) {
         const actListSelect = document.createElement("option");
         actListSelect.textContent = Act.name;
         actListSelect.value = Act.name;
         actSection.appendChild(actListSelect);
      }

      sceneSection.textContent = '';
      for (let scene of playDataGlobal.acts[actSection.selectedIndex].scenes) {
         const sceneListSelect = document.createElement("option");
         sceneListSelect.textContent = scene.name;
         sceneListSelect.value = scene.name;
         sceneSection.appendChild(sceneListSelect);

      }
      playerList.textContent = '';
      playerList.appendChild(allPlayers);
      playerList.selectedIndex = 0;

      for (let speakers of playDataGlobal.persona) {
         const speakerListSelect = document.createElement("option");
         speakerListSelect.textContent = speakers.player;
         speakerListSelect.value = speakers.player;
         playerList.appendChild(speakerListSelect);

      }
      createText(actSection.selectedIndex, sceneSection.selectedIndex);
   }

   function createText(act, scene) {

      playGenerater.textContent = '';
      playDataGlobal.acts[act].scenes[scene];
      const keyWord = keyWordInput.value;
      console.log(playDataGlobal.acts[act].scenes[scene]);

      let title = document.createElement("h2");
      title.textContent = playDataGlobal.title;
      playGenerater.appendChild(title);

      let article = document.createElement("article");
      article.id = "actHere";
      playGenerater.appendChild(article);

      let actArea = document.createElement('h3');
      actArea.textContent = playDataGlobal.acts[act].name;
      article.appendChild(actArea);

      let sceneDiv = document.createElement("div");
      sceneDiv.id = "sceneHere";
      article.appendChild(sceneDiv);

      let sceneName = document.createElement("h4");
      sceneName.textContent = playDataGlobal.acts[act].scenes[scene].name;
      sceneDiv.appendChild(sceneName);

      let sceneTitle = document.createElement("p");
      sceneTitle.className = "title";
      sceneTitle.textContent = playDataGlobal.acts[act].scenes[scene].title;
      sceneDiv.appendChild(sceneTitle);

      let stageDirection = document.createElement("p");
      stageDirection.className = "direction";
      stageDirection.textContent = playDataGlobal.acts[act].scenes[scene].stageDirection;
      sceneDiv.appendChild(stageDirection);
      article.appendChild(sceneDiv);

      for (let speech of playDataGlobal.acts[act].scenes[scene].speeches) {
         let dialogue = document.createElement("div");
         dialogue.className = "speech";

         let span = document.createElement("span");
         span.textContent = speech.speaker;

         if (playerList.selectedIndex == 0 || playerList.value == span.textContent) {
            dialogue.appendChild(span);
            // Iterate through speeches in the selected scene.
            for (let line of speech.lines) {
               let p = document.createElement('p');
               p.textContent = line;

               if (keyWord !== '' && line.includes(keyWord)) {
                  p.innerHTML = p.innerHTML.replaceAll(keyWord, "<b>" + keyWord + "</b>");
                  console.log(p);
               }
               dialogue.appendChild(p);
            }
            sceneDiv.appendChild(dialogue);
         }
      }
   }
   actSection.addEventListener('change', function () {
      const selectedAct = actSection.selectedIndex;
      sceneSection.selectedIndex = 0;
      sceneSection.textContent = '';

      for (let scene of playDataGlobal.acts[selectedAct].scenes) {
         const sceneListSelect = document.createElement("option");
         sceneListSelect.textContent = scene.name;
         sceneListSelect.value = scene.name;
         sceneSection.appendChild(sceneListSelect);
      }
      createText(selectedAct, 0);
   })
   sceneSection.addEventListener('change', function () {
      const selectedScene = sceneSection.selectedIndex;
      createText(actSection.selectedIndex, selectedScene);
   })
   playerList.addEventListener('change', function () {
      createText(actSection.selectedIndex, sceneSection.selectedIndex);
   })
   filterButton.addEventListener('click', function () {
      createText(actSection.selectedIndex, sceneSection.selectedIndex);
   })
});
