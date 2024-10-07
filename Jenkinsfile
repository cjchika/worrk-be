def COLOR_MAP = [
	'SUCCESS': 'good',
	'FAILURE': 'danger'
]

pipeline {
  agent any 
	environment {
		// DOCKER_HUB_CREDENTIALS = credentials('docker-auth')
		IMAGE_NAME = 'cjchika/backend-node'
		PORT = "${env.PORT}"
		MONGO_URI = "${env.MONGO_URI}"
		JWT_SECRET = "${env.JWT_SECRET}"
		SONAR_TOKEN = 'sonartoken'
		SONAR_SCANNER = 'sonarscanner'
		SONAR_HOST_URL = 'http://54.234.252.213'
		SONAR_PROJECT_KEY = 'backend-node'
	}

	stages {
		stage('Clone Backend Repository'){
			steps{
				git branch: 'jenkins-ci', 
				credentialsId: 'github-pat', 
				url: 'https://github.com/cjchika/worrk-be.git'
			}
		}
		stage('SonarQube Analysis'){
			environment {
					scannerHome = tool 'sonarscanner4'
				}
			steps{
				script{
					sh '''
						sonar-scanner \
						-Dsonar.projectKey=$SONAR_PROJECT_KEY \
						-Dsonar.sources=. \
						-Dsonar.host.url=$SONAR_HOST_URL \
						-Dsonar.login=$SONAR_TOKEN
					'''
				}
			}
		}
		// stage('Check Quality Gate'){
		// 	steps{
		// 		script{
		// 			timeout(time: 5, unit: 'MINUTES') {
		// 				def qualityGate = waitForQualityGate() 
		// 				if(qualityGate.status != 'OK'){
		// 					error "SonarQube Quality Gate failed: ${qualityGate.status}"
		// 				}
		// 			}
		// 		}
		// 	}
		// }
		stage('Build Backend Docker Image') {
			steps {
				script{
					sh "docker build -t $IMAGE_NAME:$BUILD_NUMBER ."
				}
			}
		}
		stage('Login to Docker Hub'){
			steps{
				script {
						withCredentials([usernamePassword(credentialsId: 'docker-auth', usernameVariable: 'DOCKER_HUB_CREDENTIALS_USR', passwordVariable: 'DOCKER_HUB_CREDENTIALS_PSW')]) {
							// sh "docker login -u $DOCKER_HUB_CREDENTIALS_USR -p $DOCKER_HUB_CREDENTIALS_PSW"
							sh """
								echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin
							"""
					}
				}
			}
		}
		stage('Push Backend Docker Image to Docker Hub') {
			steps{
					script {
						sh "docker tag $IMAGE_NAME:$BUILD_NUMBER $IMAGE_NAME:latest"
						sh "docker push $IMAGE_NAME:$BUILD_NUMBER"
						// sh "docker push $IMAGE_NAME:latest"
					}
			}
		}
	}
	post{
		always {
			cleanWs()

			echo 'Slack Notifications'

			slackSend channel: 'jenkinspipeline',
				color: COLOR_MAP[currentBuild.currentResult],
				message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_URL}"
		}
		
	}
}