document.addEventListener("DOMContentLoaded", () => {
    const mainContainer = document.getElementById("main-container");
    const testContainer = document.getElementById("test-container");
    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const timerContainer = document.getElementById("timer-container");
    const timerDisplay = document.getElementById("timer");
    const colorContainers = document.querySelectorAll(".color-container");
    const colorList = document.getElementById("color-list");
    const startTestBtn = document.getElementById("start-test-btn");
    const submitTestBtn = document.getElementById("submit-test-btn");

    let selectedColorsStep1 = [];
    let selectedColorsStep2 = [];
    let timer;

    const formActionUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe8F0S6Wh3rMFPSktJOKoeUhwbibCJmw5u8LEhridC_fIFsmg/formResponse";

    startTestBtn.addEventListener("click", () => {
        mainContainer.style.display = "none";
        testContainer.style.display = "block";
        step1.style.display = "block";
    });

    colorContainers[0].addEventListener("click", event => {
        if (event.target.classList.contains("color")) {
            if (!selectedColorsStep1.includes(event.target.dataset.value)) {
                selectedColorsStep1.push(event.target.dataset.value);
                event.target.classList.add("selected");
                updateSelectedColorsList();
            }

            if (selectedColorsStep1.length === 8) {
                colorContainers[0].style.pointerEvents = "none";
                setTimeout(() => {
                    step1.style.display = "none";
                    timerContainer.style.display = "block";
                    startTimer(15, () => {
                        timerContainer.style.display = "none";
                        step2.style.display = "block";
                    });
                }, 500);
            }
        }
    });

    colorContainers[1].addEventListener("click", event => {
        if (event.target.classList.contains("color")) {
            if (!selectedColorsStep2.includes(event.target.dataset.value)) {
                selectedColorsStep2.push(event.target.dataset.value);
                event.target.classList.add("selected");
            }

            if (selectedColorsStep2.length === 8) {
                colorContainers[1].style.pointerEvents = "none";
                submitTestBtn.style.display = "inline-block";
            }
        }
    });

    submitTestBtn.addEventListener("click", () => {
        if (selectedColorsStep1.length === 8 && selectedColorsStep2.length === 8) {
            sendDataToGoogleForms(selectedColorsStep1, selectedColorsStep2);
            alert("Тест завершен!");
            resetTest();
        } else {
            alert("Выберите по 8 цветов на каждом шаге!");
        }
    });

    function updateSelectedColorsList() {
        colorList.innerHTML = selectedColorsStep1
            .map(color => `<li>${color}</li>`)
            .join("");
    }

    function startTimer(duration, callback) {
        let timeRemaining = duration;
        timerDisplay.textContent = `00:${timeRemaining.toString().padStart(2, "0")}`;

        timer = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = `00:${timeRemaining.toString().padStart(2, "0")}`;

            if (timeRemaining < 0) {
                clearInterval(timer);
                callback();
            }
        }, 1000);
    }

    function resetTest() {
        selectedColorsStep1 = [];
        selectedColorsStep2 = [];
        clearInterval(timer);
        document.querySelectorAll(".color").forEach(c => c.classList.remove("selected"));
        colorContainers.forEach(container => (container.style.pointerEvents = "auto"));
        mainContainer.style.display = "block";
        testContainer.style.display = "none";
        step1.style.display = "none";
        step2.style.display = "none";
        timerContainer.style.display = "none";
        submitTestBtn.style.display = "none";
        colorList.innerHTML = "";
    }

    async function sendDataToGoogleForms(step1, step2) {
        const formData = new FormData();
        formData.append("entry.36312125", step1.join(", ")); // Поле для первого шага
        formData.append("entry.1567429347", step2.join(", ")); // Поле для второго шага

        try {
            await fetch(formActionUrl, {
                method: "POST",
                body: formData,
                mode: "no-cors",
            });
            alert("Данные успешно отправлены!");
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            alert("Ошибка при отправке данных. Попробуйте снова.");
        }
    }
});
