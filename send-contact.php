<?php
// send-contact.php
// Handles Essex Builders website contact/quote forms and emails enquiries to sxgroup@yahoo.co.uk

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

// Honeypot spam check. This field should stay empty.
if (!empty($_POST['website'])) {
    header('Location: contact.html');
    exit;
}

$to = 'sxgroup@yahoo.co.uk';

function clean_input($value) {
    $value = is_string($value) ? trim($value) : '';
    $value = str_replace(["\r", "\n"], ' ', $value);
    return strip_tags($value);
}

$firstName = clean_input($_POST['first_name'] ?? '');
$lastName  = clean_input($_POST['last_name'] ?? '');
$name      = clean_input($_POST['name'] ?? trim($firstName . ' ' . $lastName));
$email     = clean_input($_POST['email'] ?? '');
$phone     = clean_input($_POST['phone'] ?? '');
$service   = clean_input($_POST['service'] ?? '');
$location  = clean_input($_POST['location'] ?? '');
$budget    = clean_input($_POST['budget'] ?? '');
$message   = trim(strip_tags($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    echo 'Please complete your name, email address and project message.';
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo 'Please enter a valid email address.';
    exit;
}

$subjectService = $service !== '' ? $service : 'Website Enquiry';
$subject = 'New Essex Builders Enquiry - ' . $subjectService;

$emailBody = "New enquiry from the Essex Builders website:\n\n";
$emailBody .= "Name: {$name}\n";
$emailBody .= "Email: {$email}\n";
$emailBody .= "Phone: {$phone}\n";
$emailBody .= "Service Required: {$service}\n";
$emailBody .= "Project Location: {$location}\n";
$emailBody .= "Approximate Budget: {$budget}\n\n";
$emailBody .= "Message:\n{$message}\n\n";
$emailBody .= "---\n";
$emailBody .= "Sent from: " . ($_SERVER['HTTP_REFERER'] ?? 'Essex Builders website') . "\n";
$emailBody .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";

$headers = [];
$headers[] = 'From: Essex Builders Website <no-reply@sxbuilders.co.uk>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

if (mail($to, $subject, $emailBody, implode("\r\n", $headers))) {
    header('Location: thank-you.html');
    exit;
}

echo 'Sorry, there was a problem sending your message. Please try again or call 07958 355936.';
