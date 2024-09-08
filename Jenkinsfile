pipeline {
    agent any

    tools {
        nodejs 'nodeJS'
    }

    options { buildDiscarder(logRotator(numToKeepStr: '5')) }

    environment {
        FTP_FOLDER = "${env.BRANCH_NAME == 'master' ? 'www' : "frontend_" + env.BRANCH_NAME}"
    }
    
    stages {
        stage('Clean') {
            steps {
                cleanWs()
            }
        }

        stage('pull sources') {
            steps {
                git branch: '${BRANCH_NAME}',
                credentialsId: 'github_credentials',
                url: 'https://github.com/CineCare/cineHub-frontend'
                script {
                    env.GIT_COMMIT_MSG = sh (script: 'git log -1 --pretty=%B ${GIT_COMMIT}', returnStdout: true).trim()
                }
            }
        }

        stage('install') {
            steps {
                echo 'performing install...'
                sh '''
                    npm install
                '''
            }
        }
    }
}
