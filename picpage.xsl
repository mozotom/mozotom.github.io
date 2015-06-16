<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">

<html>
  <head>
    <title>Tomasz Mozolewski - Home Page 2008</title>
    <link href="tree.css" rel="stylesheet" type="text/css" />
    <base target="_blank" />
  </head>

  <body> 
    <h1 style="text-align: center"><xsl:value-of select="page/@title"/></h1>

    <p style="text-align: center"><table border="1" cellspacing="2" cellpadding="5"><tr>

    <xsl:for-each select="/page/imggroup">
      <th style="height: 50px; width: 150px">

        <xsl:for-each select="./link">
          <xsl:element name="a">
            <xsl:attribute name="href"><xsl:value-of select="@href" /></xsl:attribute>
            <xsl:element name="img">
              <xsl:attribute name="src"><xsl:value-of select="@img" /></xsl:attribute>
              <xsl:attribute name="style">border: 0px</xsl:attribute>
              <xsl:attribute name="alt"><xsl:value-of select="@name" /></xsl:attribute>
            </xsl:element>
          </xsl:element>
        </xsl:for-each>

      </th>

      <xsl:if test="position() mod /page/@columns = 0 and position() != last()">
        <xsl:value-of select="concat('&lt;','/tr','&gt;','&lt;','tr','&gt;')" disable-output-escaping="yes"/>
    </xsl:if>
    </xsl:for-each>


    </tr></table></p>
  </body>             
</html>

</xsl:template>
</xsl:stylesheet>

