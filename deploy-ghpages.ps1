$ErrorActionPreference = "Continue"
$repo = "doyourbestt/love-couple-website"
$branch = "gh-pages"
$token = "REDACTED_TOKEN2"

$headers = @{
    Authorization          = "Bearer $token"
    Accept                 = "application/vnd.github+json"
    "User-Agent"           = "deploy-script"
    "X-GitHub-Api-Version" = "2022-11-28"
}

function Call-GitHubApi {
    param([string]$Uri, [string]$Method = "GET", [string]$Body = $null)
    $args = @{
        Uri = $Uri
        Method = $Method
        Headers = $headers
        UseBasicParsing = $true
        TimeoutSec = 60
    }
    if ($Body) { $args.Body = $Body; $args.ContentType = "application/json" }
    $resp = Invoke-WebRequest @args
    if ($resp.Content) {
        return ($resp.Content | ConvertFrom-Json)
    }
    return $null
}

$distPath = "d:\MyProject\Trae\love-website\dist"
Write-Host "Dist path: $distPath"
Write-Host "Exists: $(Test-Path $distPath)"

if (-not (Test-Path $distPath)) { Write-Host "ERROR: dist/ not found"; exit 1 }

Write-Host "==> Getting SHA of branch '$branch'..."
$ref = Call-GitHubApi -Uri "https://api.github.com/repos/$repo/git/ref/heads/$branch"
$baseSha = $ref.object.sha
Write-Host "Existing gh-pages SHA: $baseSha"

$files = Get-ChildItem -Path $distPath -Recurse -File
Write-Host "==> Found $($files.Count) files in dist/"

$treeItems = @()
foreach ($file in $files) {
    $relPath = $file.FullName.Substring($distPath.Length).TrimStart('\','/').Replace('\','/')
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $content = [Convert]::ToBase64String($bytes)
    $body = @{ content = $content; encoding = "base64" } | ConvertTo-Json -Compress
    $blob = Call-GitHubApi -Uri "https://api.github.com/repos/$repo/git/blobs" -Method Post -Body $body
    $treeItems += [PSCustomObject]@{ path = $relPath; sha = $blob.sha; mode = "100644"; type = "blob" }
    Write-Host "  blob $relPath -> $($blob.sha.Substring(0,7))"
}

Write-Host "==> Creating tree..."
$treeBody = @{ base_tree = $baseSha; tree = $treeItems } | ConvertTo-Json -Depth 10 -Compress
$tree = Call-GitHubApi -Uri "https://api.github.com/repos/$repo/git/trees" -Method Post -Body $treeBody
Write-Host "Tree SHA: $($tree.sha)"

Write-Host "==> Creating commit..."
$commitBody = @{ message = "deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"; tree = $tree.sha; parents = @($baseSha) } | ConvertTo-Json -Compress
$commit = Call-GitHubApi -Uri "https://api.github.com/repos/$repo/git/commits" -Method Post -Body $commitBody
Write-Host "Commit SHA: $($commit.sha)"

Write-Host "==> Updating ref..."
$refBody = @{ sha = $commit.sha; force = $true } | ConvertTo-Json -Compress
$null = Call-GitHubApi -Uri "https://api.github.com/repos/$repo/git/refs/heads/$branch" -Method "PATCH" -Body $refBody

Write-Host ""
Write-Host "Done!"
Write-Host "Visit: https://doyourbestt.github.io/love-couple-website/"