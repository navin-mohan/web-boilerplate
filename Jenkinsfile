pipeline {
	agent {
		docker {
			image 'nm73/nodejs-docker-build-env'
		}
	}

	stages {
		stage("Build") {
			steps {
				sh 'bash ./scripts/docker_build.sh'
			}
		}

		stage("Deploy") {
			steps {
				withAWS(credentials:'test-bucket-credentials') {
					s3Upload(bucket:"test-bucket-jenkins",path:"/",includePathPattern:"**/*",workingDir:"dist")
				}
			}
		}
	}
}
