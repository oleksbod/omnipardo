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
                //console.log("Sending camera str data:", JSON.stringify(data));
                cloudstream.sendJsonData(data);

                document.querySelectorAll(".camera").forEach((c) => c.classList.remove("active"));
                camera.classList.add("active");
            });
        });

        document.querySelectorAll(".scene").forEach((scene) => {
            scene.addEventListener("click", () => {
                const parent = scene.closest(".scene-container").parentElement;

                // remove previous active in the same container
                parent.querySelectorAll(".scene").forEach((el) => el.classList.remove("active"));
                scene.classList.add("active");

                // get combined value
                const activeEx = document.querySelector(".exterior-scenes-container .scene.active");
                const activeIn = document.querySelector(".interior-scenes-container .scene.active");

                const exValue = activeEx ? activeEx.dataset.exscene : "";
                const inValue = activeIn ? activeIn.dataset.inscene : "";

                const value = exValue && inValue ? `${exValue}_${inValue}` : exValue || inValue;

                const data = {
                    Type: 1,
                    Key: "",
                    Value: value,
                };

                console.log("Sending scene data:", data);
                cloudstream.sendJsonData(data);
            });
        });

        document.querySelectorAll(".exterior-scenes-container").forEach((container) => {
            const label = container.previousElementSibling;
            const wrappers = container.querySelectorAll(".texture-wrapper");

            wrappers.forEach((wrapper) => {
                wrapper.addEventListener("click", () => {
                    wrappers.forEach((w) => w.classList.remove("active"));

                    wrapper.classList.add("active");
                    //{"Type":2,"Key":"Hull5 : 1","Value":"mat020"}

                    const data = {
                        Type: 2,
                        Key: wrapper.dataset.mesh,
                        Value: wrapper.dataset.mat,
                    };

                    console.log("Sending material data:", data);
                    cloudstream.sendJsonData(data);

                    if (label && label.classList.contains("normal")) {
                        label.textContent = wrapper.dataset.name;
                    }
                });
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
