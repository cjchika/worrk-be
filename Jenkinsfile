def COLOR_MAP = [
	'SUCCESS': 'good',
	'FAILURE': 'danger'
]

pipeline {
  agent any 
	environment {
		ARTIFACT_NAME = "backend-job-app${BUILD_ID}.zip"
		AWS_S3_BUCKET = 'backend-job'
		AWS_EB_APP_NAME = 'backend-job'
		AWS_EB_ENVIRONMENT = 'Backend-job-env'
		AWS_EB_APP_VERSION = "${BUILD_ID}"
	}

	stages {
		stage('Clone Backend Repository'){
			steps{
				git branch: 'jenkins-hybrid-cd', 
				credentialsId: 'github-token', 
				url: 'https://github.com/cjchika/worrk-be.git'
			}
		}

		 stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install --production'
                }
            }
        }

		stage('Build Backend App for Beanstalk') {
			steps {
				script{
					sh "zip -r $ARTIFACT_NAME ./"
				}
			}
		}

		stage('Upload to S3') {
			steps {
				withAWS(credentials: "${env.CREDVAR}", region: "${env.REGION}"){
					sh "aws s3 cp app-artifact.zip s3://$AWS_S3_BUCKET/$ARTIFACT_NAME"
				}
			}  
        }

		stage('Deploy to Beanstalk') {
			steps {
				withAWS(credentials: "${env.CREDVAR}", region: "${env.REGION}"){
					// sh 'aws s3 cp ./app-artifact.zip s3://$AWS_S3_BUCKET/$ARTIFACT_NAME'
					sh 'aws elasticbeanstalk create-application-version --application-name $AWS_EB_APP_NAME --version-label $AWS_EB_APP_VERSION --source-bundle S3Bucket=$AWS_S3_BUCKET,S3Key=$ARTIFACT_NAME'
               		sh 'aws elasticbeanstalk update-environment --application-name $AWS_EB_APP_NAME --environment-name $AWS_EB_ENVIRONMENT --version-label $AWS_EB_APP_VERSION'
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