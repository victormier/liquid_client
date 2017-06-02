IMAGE_REPO=victormier/mvp2_client
IMAGE_VERSION=v1.0
IMAGE=$IMAGE_REPO:$IMAGE_VERSION

if [[ `docker images --format "{{.Repository}}:{{.Tag}}" | grep $IMAGE` = "" ]]; then
  echo "Building image"
  docker build --no-cache=true -t $IMAGE .
else
  echo "Image found: "$IMAGE
fi

# run image
docker stop mvp2_client_container
docker rm mvp2_client_container
docker run --publish 8080:8080 -v "$(pwd)":/usr/src/app --name mvp2_client_container $IMAGE_REPO:$IMAGE_VERSION
