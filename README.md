# PhantomJS Lambda Template

This is a reference implementation of running [PhantomJS](http://phantomjs.org/) on [AWS Lambda](http://aws.amazon.com/lambda/) deployed with [AWS CodePipeline](https://aws.amazon.com/codepipeline/).

## Background
PhantomJS needs to be compiled for the OS you plan on running it and this can be painful because of that fact. This could be circumvented with a build server, which is a very personal decision and it was hard to commit to a build server for this little project.
Now with [AWS CodeBuild](http://aws.amazon.com/codebuild/), this has become a trivial matter. So we are using AWS Developer tools 100%, AWS created a great
[walk through: Automating Deployment of Lambda-based Applications](http://docs.aws.amazon.com/lambda/latest/dg/automating-deployment.html)
I have done my best to automate the walk through, so its simple and repeatable.

## Setup prerequisites
1. Setup your AWS account and AWS CLI (using the aws configure command)
1. Clone/download this project to your PC. 
1. Setup a personal access token with GitHub for [AWS CodePipeline](https://aws.amazon.com/codepipeline/) , you can skip this if you use [AWS CodeCommit](https://aws.amazon.com/codecommit/) but you will have to change the cloudformation.
https://github.com/settings/tokens

#### Deploy the CodeBuild pipeline
```
npm run deploy-pipeline -- --parameter-overrides \
           EnvironmentName=phantom \
           GitHubToken=< your token > \
           GitHubUser=justengland \
           Repo=phantom-lambda-template \
           Branch=master
# **Note:** npm version 2.x or newer required to pass arguments to the scripts using `-- args`
```
#### View your work
1. Checkout [AWS CloudFormation](https://console.aws.amazon.com/cloudformation/home)
1. Watch as [AWS CodePipeline](https://console.aws.amazon.com/codepipeline/home) creates a new stack
1. Once the stacks are finished test your [AWS Lambda](https://console.aws.amazon.com/lambda/home)

#### Configuring the Chart Lambda functions
You have to set two environment variables on the chart Lambda functions:

LD_LIBRARY_PATH=/var/task:/var/task/lib:/var/lang/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/opt/lib

FONTCONFIG_PATH=/var/task/fonts

These are in addition to the MemoBaseURL, SysUser etc. environment variables.