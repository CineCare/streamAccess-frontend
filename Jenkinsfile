pipeline {
    agent any

    tools {
        nodejs 'nodeJS'
    }

    options { buildDiscarder(logRotator(numToKeepStr: '5')) }

    environment {
        FTP_FOLDER = "${env.BRANCH_NAME == 'main' ? 'streamaccess' : "frontend_" + env.BRANCH_NAME}"
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

        stage('Publish to FTP') {
            when {
                expression { env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'dev'}
            }
            steps {
                echo "branch name : ${BRANCH_NAME}"
                echo "FTP dist folder : ${FTP_FOLDER}"
                ftpPublisher alwaysPublishFromMaster: false, continueOnError: false, failOnError: false, paramPublish: [parameterName:""], masterNodeName: '', publishers: [[configName: 'planethoster', transfers: [[asciiMode: false, cleanRemote: true, excludes: '', flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "${FTP_FOLDER}", remoteDirectorySDF: false, removePrefix: 'dist/', sourceFiles: 'dist/']], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false]]
            }
        }
    }

    post {
        always {
            sh "echo ${GIT_COMMIT_MSG}"
            discordSend description: "Jenkins Pipeline Build StreamAccess Frontend ${BRANCH_NAME} failed ! ☹️\n\ngit commit message :\n${GIT_COMMIT_MSG}",
            footer: "Better luck next try ?",
            link: "$BUILD_URL",
            result: currentBuild.currentResult,
            title: JOB_NAME,
            webhookURL: "https://discord.com/api/webhooks/1208855718338363572/hPxGKwxnigUMvt0ZaPSsAiU1p8Udkdpg4Yo79UCIfo_lxm7Phbe-JLYdTV-22GFCXvYU"
        }
        fixed {
            discordSend description: "Jenkins Pipeline Build StreamAccess Frontend ${BRANCH_NAME} succeed ! 😎\n\ngit commit message :\n${GIT_COMMIT_MSG}",
            footer: "Good job !",
            link: "$BUILD_URL",
            result: currentBuild.currentResult,
            title: JOB_NAME, webhookURL: "https://discord.com/api/webhooks/1208855718338363572/hPxGKwxnigUMvt0ZaPSsAiU1p8Udkdpg4Yo79UCIfo_lxm7Phbe-JLYdTV-22GFCXvYU"
        }
    }
}
