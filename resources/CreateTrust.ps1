$publicCertPath = "C:\Certificates\sp2013devDer.cer" 
$authorityName = "Addins trust authority" # display name of the trusted root authority
$issuerId = "9e9e46c4-6329-4990-a0b8-13b87b3ba56a" # any guid used as issuer id
$tokenIssuerName = "Addins token issuer" # display name for trusted token issuer


$certificate = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($publicCertPath)
New-SPTrustedRootAuthority -Name $authorityName -Certificate $certificate

$realm = Get-SPAuthenticationRealm

$fullIssuerIdentifier = $issuerId + "@" + $realm
New-SPTrustedSecurityTokenIssuer -Name $tokenIssuerName -Certificate $certificate -RegisteredIssuerName $fullIssuerIdentifier -IsTrustBroker
iisreset