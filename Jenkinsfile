pipeline {
    agent any

    tools {
        nodejs 'nodeJS'
    }

    options { buildDiscarder(logRotator(numToKeepStr: '5')) }

    environment {
        DOCKER_CREDENTIALS = credentials('codevertDocker')
        DOCKER_TAG = "${env.BRANCH_NAME == 'main' ? 'latest' : env.BRANCH_NAME}"
        DISCORD_WEBHOOK = credentials('discord-webhook')
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
                url: 'https://github.com/CineCare/streamAccess-frontend'
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

        stage('build') {
            steps {
                echo 'performing build'
                sh '''
                    npm run build
                '''
            }
        }

        // stage('Publish to FTP') {
        //     when {
        //         expression { env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'dev'}
        //     }
        //     steps {
        //         echo "branch name : ${BRANCH_NAME}"
        //         echo "FTP dist folder : ${FTP_FOLDER}"
        //         ftpPublisher alwaysPublishFromMaster: false, continueOnError: false, failOnError: false, paramPublish: [parameterName:""], masterNodeName: '', publishers: [[configName: 'planethoster', transfers: [[asciiMode: false, cleanRemote: true, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "${FTP_FOLDER}", remoteDirectorySDF: false, removePrefix: 'dist/', sourceFiles: 'dist/']], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false]]
        //     }
        // }
        stage('build & push docker image') {
            when {
                expression { env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'dev'}
            }
            steps {
                //connect to docker hub, build image and push to registry
                sh '''
                    echo $DOCKER_CREDENTIALS_PSW | docker login localhost:5000 -u $DOCKER_CREDENTIALS_USR --password-stdin
                    docker build -t "localhost:5000/streamaccess:frontend_${DOCKER_TAG}" .
                    docker push localhost:5000/streamaccess:frontend_${DOCKER_TAG}
                '''
            }
        }

        stage('Update stack portainer') {
            when {
                expression { env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'dev'}
            }
            steps {
                //stop and restart portainer stack via api
                withCredentials([string(credentialsId: 'portainer_token', variable: 'TOKEN')]) { //set SECRET with the credential content
                    sh '''
                        curl -X POST -H "X-API-Key: ${TOKEN}" https://portainer.codevert.org/api/stacks/7/stop?endpointId=2 &&
                        curl -X POST -H "X-API-Key: ${TOKEN}" https://portainer.codevert.org/api/stacks/7/start?endpointId=2
                    '''
                }
            }
        }
    }

    post {
        regression {
            sh "echo ${GIT_COMMIT_MSG}"
            discordSend description: "Jenkins Pipeline Build StreamAccess Frontend ${BRANCH_NAME} failed ! ☹️\n\ngit commit message :\n${GIT_COMMIT_MSG}",
            footer: "Better luck next try ?",
            link: "$BUILD_URL",
            result: currentBuild.currentResult,
            title: JOB_NAME,
            webhookURL: "${DISCORD_WEBHOOK}"
        }
        fixed {
            discordSend description: "Jenkins Pipeline Build StreamAccess Frontend ${BRANCH_NAME} succeed ! 😎\n\ngit commit message :\n${GIT_COMMIT_MSG}",
            footer: "Good job !",
            link: "$BUILD_URL",
            result: currentBuild.currentResult,
            title: JOB_NAME, webhookURL: "${DISCORD_WEBHOOK}"
        }
    }
}
