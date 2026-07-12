$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$output = Join-Path $PSScriptRoot '..\public\images\vantalume-social-share.png'
New-Item -ItemType Directory -Force (Split-Path $output) | Out-Null

$bitmap = New-Object Drawing.Bitmap 1200, 630
$graphics = [Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([Drawing.Color]::FromArgb(244, 240, 232))

$gridPen = New-Object Drawing.Pen ([Drawing.Color]::FromArgb(18, 21, 29, 32)), 1
for ($x = 0; $x -le 1200; $x += 60) { $graphics.DrawLine($gridPen, $x, 0, $x, 630) }
for ($y = 0; $y -le 630; $y += 60) { $graphics.DrawLine($gridPen, 0, $y, 1200, $y) }

$ringPen = New-Object Drawing.Pen ([Drawing.Color]::FromArgb(52, 198, 139, 48)), 1
for ($size = 160; $size -le 620; $size += 72) { $graphics.DrawEllipse($ringPen, 1000 - $size / 2, 110 - $size / 2, $size, $size) }

$ink = New-Object Drawing.SolidBrush ([Drawing.Color]::FromArgb(23, 32, 36))
$accent = New-Object Drawing.SolidBrush ([Drawing.Color]::FromArgb(198, 139, 48))
$muted = New-Object Drawing.SolidBrush ([Drawing.Color]::FromArgb(86, 84, 79))
$brandFont = New-Object Drawing.Font 'Arial', 23, ([Drawing.FontStyle]::Regular)
$headlineFont = New-Object Drawing.Font 'Georgia', 58, ([Drawing.FontStyle]::Regular)
$accentFont = New-Object Drawing.Font 'Georgia', 58, ([Drawing.FontStyle]::Italic)
$bodyFont = New-Object Drawing.Font 'Arial', 22, ([Drawing.FontStyle]::Regular)

$graphics.DrawString('V A N T A L U M E', $brandFont, $ink, 82, 70)
$graphics.DrawString('Web, App &', $headlineFont, $ink, 78, 190)
$graphics.DrawString('AI Solutions', $accentFont, $accent, 78, 263)
$graphics.FillRectangle($accent, 82, 354, 112, 5)
$graphics.DrawString('Websites, applications and practical AI automation', $bodyFont, $muted, 82, 405)
$graphics.DrawString('built around a clear business case.', $bodyFont, $muted, 82, 442)
$graphics.DrawString('vantalume.com', $bodyFont, $ink, 82, 525)

$bitmap.Save($output, [Drawing.Imaging.ImageFormat]::Png)
$brandFont.Dispose(); $headlineFont.Dispose(); $accentFont.Dispose(); $bodyFont.Dispose()
$ink.Dispose(); $accent.Dispose(); $muted.Dispose(); $gridPen.Dispose(); $ringPen.Dispose()
$graphics.Dispose(); $bitmap.Dispose()
