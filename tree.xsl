<?xml version="1.0" encoding="ISO-8859-1"?>

<!-- Copyright Tomasz Mozolewski @2004 -->
<!-- Updated Tomasz Mozolewski @2011 -->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">

      <head>
        <title><xsl:value-of select="/root/@title"/></title>
        <script type="text/javascript" src="tree.js"></script>
        <link href="tree.css" rel="stylesheet" type="text/css" />
        <base target="node" />
      </head>

      <body>
        <!-- Header -->
        <table width="100%"><tr><td>
          <table><tr>
            <td id="tdinput1" class="medium">
              <input 
                id="input1" 
                class="inactive" 
                maxlength="2048" 
                name="t" 
                title="Tree Search" 
                value="Tree" 
                onblur="blurInput(1);" 
                onfocus="focusInput(1);" 
                onkeyup="treeFind(value)"
              />
            </td>
            <td id="tdinput2" class="medium">
              <input 
                id="input2" 
                class="inactive" 
                maxlength="2048" 
                title="Google Search" 
                value="Google" 
                onblur="blurInput(2);" 
                onfocus="focusInput(2);" 
                onkeypress="searchGoogle(event, value);" 
              />
            </td>
            <td id="tdinput3" class="medium">
              <input 
                id="input3" 
                class="inactive" 
                maxlength="2048" 
                title="Wikipedia Search" 
                value="Wikipedia" 
                onblur="blurInput(3);" 
                onfocus="focusInput(3);" 
                onkeypress="searchWikipedia(event, value);" 
              />
            </td>
          </tr></table>
        </td></tr><tr><td>
          <div id="treeFindResult"></div>
        </td></tr></table>

        <!-- Body -->
        <hr /><table><xsl:apply-templates /></table><hr />

        <!-- Footer -->
        <div class="footer">
          <a id="editLink">Edit</a>
          <script type="text/javascript">document.getElementById("editLink").href = "view-source:" + location.href</script>
          - <script type="text/javascript">document.write(document.lastModified)</script>
          - <a href=".">Update</a>
        </div>
      </body>
  
    </html>
  </xsl:template>
  
  <xsl:template match="branch">
    <script type="text/javascript">baseName.push("<xsl:value-of select="@name" />")</script>

    <!-- Variable declaration section -->
    <xsl:variable name="uniqeID" select="generate-id()" />

    <tr><td class="tree">

      <!-- Plus - Minus Picture -->
      <xsl:if test="count(./branch) != 0">
        <xsl:element name="img">
          <xsl:attribute name="id">imgTag_<xsl:value-of select="$uniqeID" /></xsl:attribute>
          <xsl:attribute name="src">plus.bmp</xsl:attribute>
          <xsl:attribute name="style">cursor: pointer; margin-top: 5px</xsl:attribute>
          <xsl:attribute name="onclick">flip("<xsl:value-of select="$uniqeID" />")</xsl:attribute>
        </xsl:element>
      </xsl:if>

    </td><td class="tree">

      <!-- Name -->
      <xsl:choose>
        <xsl:when test="@link != ''">
          <xsl:element name="a">
            <xsl:attribute name="href"><xsl:value-of select="@link" /></xsl:attribute>
            <xsl:attribute name="title"><xsl:value-of select="@info" /></xsl:attribute>
            <xsl:attribute name="target"><xsl:value-of select="@target" /></xsl:attribute>
            <xsl:value-of select="@name" />
          </xsl:element>
          <script type="text/javascript">
            addLink("<xsl:value-of select="@name" />", "<xsl:value-of select="@link" />", "<xsl:value-of select="@info" />", "<xsl:value-of select="@target" />")
          </script>
        </xsl:when>
        <xsl:otherwise>
          <xsl:element name="b">
            <xsl:attribute name="onclick">flip("<xsl:value-of select="$uniqeID" />")</xsl:attribute>
            <xsl:attribute name="title"><xsl:value-of select="@info" /></xsl:attribute>
            <xsl:value-of select="@name" />
          </xsl:element>
        </xsl:otherwise>
      </xsl:choose>
	  
      <!-- Subdirectories -->
      <xsl:if test="count(./branch) != 0">
        <xsl:element name="div">
          <xsl:attribute name="id">branchTag_<xsl:value-of select="$uniqeID" /></xsl:attribute>
          <xsl:attribute name="style">display: none</xsl:attribute>
          <table><xsl:apply-templates /></table>
        </xsl:element>
      </xsl:if>

    </td></tr>

    <script type="text/javascript">baseName.pop()</script>
  </xsl:template>

</xsl:stylesheet>