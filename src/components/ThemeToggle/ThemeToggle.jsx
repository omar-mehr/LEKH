import './ThemeToggle.css'

function ThemeToggle({ theme, setTheme }) {

    return (
        <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
        >
            <option value="light">Light mode</option>
            <option value="dark">Dark mode</option>
        </select>
    )
}

export default ThemeToggle