/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Noto Sans", "Poppins", "Arial"],
                def: ["Ubuntu", "Noto Sans", "Arial"],
                pop: ["Poppins", "Noto Sans", "Arial"],
                // sans가 제일 기본 상속 폰트이므로 전체 폰트바꾸려면 sans재지정후 맨앞에 원하는 폰트 넣기
            },
        },
    },
    plugins: [],
};
