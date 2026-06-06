window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const membership = urlParams.get('membership')
    if(membership) {
        const selectElement = document.getElementById('membership')
        selectElement.value = membership
    }
})
