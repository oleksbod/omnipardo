const libzl = new LibZL();

const cloudstreamSettings = {
    directConnection: false,
    cloudConnectionParameters: {
        customer: "omnistream",
        renderService: "078fc39dtestser",
    },
    streamingMode: "video",
    parent: "streamContainer",
};

libzl.cloudstream("cloudstreamExample").then(function (api) {
    //Adding to the global namespace
    cloudstream = window.cloudstream = api;

    //Adding event listeners to what we're interested in
    cloudstream.addEventListener("error", function (error) {
        console.log("OmniStream had an error: ", error);
    });
    cloudstream.addEventListener("streamReady", function () {
        console.log("The stream is ready!");

        // Attach click listeners to cameras
        document.querySelectorAll(".camera").forEach((camera) => {
            camera.addEventListener("click", () => {
                const camName = camera.dataset.camera; // e.g. "Poppa"

                const data = {
                    Type: 0,
                    Key: "test",
                    Value: camName,
                };

                console.log("Sending camera data:", data);
                console.log("Sending camera str data:", JSON.stringify(data));
                cloudstream.sendJsonData(JSON.stringify(data));
            });
        });
    });

    cloudstream.addEventListener("jsondatareceived", (args) => {
        // Get the text from the message and convert to json object
        console.warn(args);
        const data = JSON.parse(args);
        console.log(data);
        // display as string
        const jsonString = JSON.stringify(data);
        console.warn("jsondatareceived", jsonString);
        //print it
        console.log(jsonString);
    });

    //Connecting to the stream
    //    - options contains parent DOM element name to attach to
    cloudstream.connect(cloudstreamSettings);
});
