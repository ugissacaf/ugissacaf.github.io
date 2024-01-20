<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve the form data
    $name = $_POST["name"];
    $message = $_POST["message"];




    echo "Form submitted successfully! Thank you, $name, for your message";
} else {
    
    echo "Invalid request method";
}
?>