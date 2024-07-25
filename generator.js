const { exec } = require('child_process');
const readline = require('readline');
const async = require('async'); // Import the 'async' library
const path = require('path');
const fs = require('fs');
const configData = require('./config/generator-config.json');
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const zipdir = require('zip-dir')

const app = express();
// let projectName='';
// Set up middleware to parse request bodies
app.use(bodyParser.json());
var dir = path.join(__dirname, 'assets/images');

// const apiKey = "sk-proj-zwPO5fdqRAyu8hIpgOD3T3BlbkFJOIRi7uSeJKSHAc9juFoz-keystone";
  const openai = new OpenAI({
    apiKey,
  });
app.use(express.static(dir));
// Dummy questions data (to be replaced by database interaction)
let questions = [
  'Enter the name of the application: ',
  'Choose the style format (css/scss): ',
  'Enable routing (yes/no): ',
  'Select the framework (angular/vue/react): ',
];

var answers = {};
var appName;
var projectName;
var style;
var framework;
var routing;
var componentToCreate;

// GET endpoint to fetch all employees
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/BotUI/index.html');
});

app.post('/askAI', (req, response) => {
  openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [{ role: "user", content: req.body.question }],
  }).then((res) => {
    console.log("openai has sent response for the question asked")
    response.send({res: res.choices[0].message.content});
  }).catch((e) => {
    console.log(e);
  });
});

// POST endpoint to add a new employee
app.post('/questions', (req, res) => {
  answers = req.body;
  appName = answers.appName;
  projectName = `Dell.MyAccount.${appName}`;
  style = answers.style;
  framework = answers.framework;
  routing = answers.routing;
  componentToCreate = answers.componentToCreate;


  // Basic validation
  if (!answers.appName || !answers.style || !answers.routing || !answers.framework) {
    return res.status(400).json({ message: 'Please provide all the details' });
  }

  initiateTheCreation();
  // Add the new employee to the list

  console.log("Created new app");
  // Respond with the newly created employee
  res.status(201);
});

const initiateTheCreation = () => {
  //cycle:2

  async.parallel([
    (callback) => {
      require('fs').mkdir(`${appName}`, (err) => {
        if (err) {
          console.error(`Error creating the folder: ${err}`);
          callback(err);
          return;
        }
        process.chdir(`${appName}`);
        callback();
      });
    },
    (callback) => {

      console.log(`${framework} application generation complete.`);

      // Now, add .NET web application (customize this part)
      console.log('Adding a .NET web application... (customize this part)');
      exec(`cd ${appName} && dotnet new web -n ${projectName}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error creating the .NET web app: ${error}`);
          return;
        }
        console.log('.NET web application created.');

        // Call the test function after everything is complete
        createDotNetApp();
        callback();
      });
    },
  ], (err) => {
    if (!err) {

    }

  });

}



const createClientApp = (answer, callback) => {
  switch (framework.toLowerCase()) {
    case 'angular':
      // Create a new Angular application using Angular CLI
      exec(`cd ${projectName} && npx -p @angular/cli ng new ClientApp --style=${style} --routing=${routing} --skip-install`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error creating the Angular app: ${error}`);
          callback(error);
          return;
        }
        callback();
      });
      break;
    case 'vue':
      // Create a new Vue.js application using Vue CLI
      exec(`cd ${projectName} &&  npx -p @vue/cli vue create clientapp`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error creating the Vue app: ${error}`);
          callback(error);
          return;
        }
        callback();
      });
      break;
    case 'react':
      // Create a new React application using Create React App
      exec(`cd ${projectName} &&  npx create-react-app clientapp`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error creating the React app: ${error}`);
          callback(error);
          return;
        }
        callback();
      });
      break;
    default:
      console.error('Unsupported framework selected.');
      callback(new Error('Unsupported framework'));
  }
}


//cycle:5
const createDefaultFileForMfe = async () => {
  const basePath = __dirname;
  console.log('basePath', basePath);
  const targetPath = path.join(__dirname, appName);
  console.log('targetPath', targetPath);
  copyFilesAndFolders('ServerApp', configData, basePath, targetPath, () => { })
    .then(() => {
      console.log('Files and folders copied successfully.');
      //code for generate the component through AI
      generateAICode();
    })
    .catch((error) => {
      console.error('Error copying files and folders:', error);
    });
}


//cycle:6
async function copyFilesAndFolders(checkKey, data, basePath, targetPath, callback) {
  for (const key in data) {
    if (key === 'folder' && Array.isArray(data[key])) {
      for (const folder of data[key]) {
        const folderPath = path.join(targetPath, folder.name);
        await fs.mkdir(folderPath, { recursive: true }, (err) => {
          if (err) {
            console.error(`Error creating the folder: ${err}`);
            callback(err);
            return;
          }
          process.chdir(folderPath);
          callback();
        });
        if (folder.files && Array.isArray(folder.files)) {
          for (const file of folder.files) {
            const sourceFilePath = path.join(basePath, file.path);
            const targetFilePath = path.join(folderPath, file.name);
            fs.copyFileSync(sourceFilePath, targetFilePath);
          }
        }
      }
    }
    else if (key === 'files' && Array.isArray(data[key])) {
      for (const file of data[key]) {
        const sourceFilePath = path.join(basePath, file.path);
        const targetFilePath = path.join(targetPath, file.name);
        fs.copyFileSync(sourceFilePath, targetFilePath);
      }
    }
    else if (typeof data[key] === 'object') {
      let checkas = '';
      if (key === 'application') {
        checkas = projectName;
      } else if (key === 'app') {
        checkas = '';
      }
      else {
        checkas = key;
      }
      const subTargetPath = path.join(targetPath, checkas);
      await copyFilesAndFolders(checkKey, data[key], basePath, subTargetPath, callback);
    }
  }
}

const generateAICode = async () => {
  const targetPath = path.join(__dirname, appName);
  const folderPath = path.join(targetPath, projectName);
  console.log('folderPath', folderPath);
  console.log('step 3 exectued', answers[3], projectName)

  if (framework == 'angular') {

    const clientPath = path.join(folderPath, 'ClientApp');
      exec(`cd ${clientPath} && ng generate component ${componentToCreate}-component`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error creating the Angular app: ${error}`);
          return;
        }
        console.log('AI component created.');
        createDynamicComponent(componentToCreate);

      });
    
  }
}

const createDynamicComponent = (componentToCreate) => {
  const apiKey = "sk-proj-zwPO5fdqRAyu8hIpgOD3T3BlbkFJOIRi7uSeJKSHAc9juFoz";
  const openai = new OpenAI({
    apiKey,
  });
    openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [{ role: "user", content: `generate a html page that contain ${componentToCreate} code with beautifull css` }],
    }).then((res) => {
        console.log("openai has generated the code for component")
        let htmlContent = extractBodyContent(res.choices[0].message.content, '<body>', '</body>');
        let cssContent = extractBodyContent(res.choices[0].message.content, '<style>', '</style>');
        updateComponentFiles(htmlContent, cssContent);
    }).catch((e) => {
      console.log(e);
    });
  
}

const downloadMFEZIP = ()=>{
  zipdir(
    path.join(__dirname, appName),
    { saveTo: `${__dirname}/assets/${appName}.zip` },
    (err, buffer) => {
        if (err) throw err;
        console.log('New zip file created!');
        res.download(`${__dirname}/assets/${appName}.zip`);
    }
);
}

updateComponentFiles = (htmlContent, cssContent) => {
  const targetPath = path.join(__dirname, appName);
  const folderPath = path.join(targetPath, projectName);
  const clientPath = path.join(folderPath, 'ClientApp');
  const componentPath = path.join(clientPath, `src/app/${componentToCreate}-component`);
  const cssPath = path.join(clientPath, `src/app/${componentToCreate}-component/${componentToCreate}-component.component.css`);
  const htmlPath = path.join(clientPath, `src/app/${componentToCreate}-component/${componentToCreate}-component.component.html`);
  fs.writeFileSync(cssPath, cssContent);
  fs.writeFileSync(htmlPath, htmlContent);
  console.log('Component files updated.');
  setTimeout(() => {
    downloadMFEZIP();
  },500)
};

extractBodyContent = (html,bodyStartTag,bodyEndTag) => {
  
  const startIndex = html.indexOf(bodyStartTag) + bodyStartTag.length;
  const endIndex = html.indexOf(bodyEndTag);

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
      throw new Error('Invalid HTML content or <body> tags not found');
  }

  return html.substring(startIndex, endIndex).trim();
}

//cycle:3
const createDotNetApp = () => {
  console.log('Test function executed.');


  // Specify the source (assets) and target (application folder) paths
  const assetsPath = path.join(__dirname, 'assets/appsettings');
  const appFolderPath = path.join(__dirname, appName + `/${projectName}`);

  // Copy files from assets to the application folder
  async.parallel([
    (callback) => {
      //cycle:4
      createClientApp(answers, () => {
        console.log('step 2 exectued')
        createDefaultFileForMfe();
        callback();
        console.log('Files copied from assets to the application folder.');
      });
    },
    (callback) => {
      require('fs').mkdir(`${projectName}/ServerApp`, (err) => {
        if (err) {
          console.error(`Error creating the folder: ${err}`);
          callback(err);
          return;
        }
        process.chdir(`${projectName}/ServerApp`);
        callback();
      });
    }
  ]);
};




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});