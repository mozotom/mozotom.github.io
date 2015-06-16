<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">

<!-- Pivot Table Example -->
<!-- Tomasz Mozolewski @2006 -->

<html>

<head>
  <title><xsl:value-of select="/pivot-table/@title"/></title>
  <script type="text/javascript" src="pivot-table.js"></script>
</head>

<body>
<h1><xsl:value-of select="/pivot-table/@title" /></h1>

<div id="pivot_table" />

<script type="text/javascript">
  <xsl:if test="/pivot-table/format/row/@order != ''">
    row_order="<xsl:value-of select="/pivot-table/format/row/@order" />"
  </xsl:if>
  <xsl:if test="/pivot-table/format/col/@order != ''">
    col_order="<xsl:value-of select="/pivot-table/format/col/@order" />"
  </xsl:if>

  <xsl:if test="/pivot-table/format/row/@data-type != ''">
    row_data_type="<xsl:value-of select="/pivot-table/format/row/@data-type" />"
  </xsl:if>
  <xsl:if test="/pivot-table/format/col/@data-type != ''">
    col_data_type="<xsl:value-of select="/pivot-table/format/col/@data-type" />"
  </xsl:if>

  <xsl:if test="/pivot-table/format/row/@using != ''">
    row_order_by="<xsl:value-of select="/pivot-table/format/row/@using" />"
  </xsl:if>
  <xsl:if test="/pivot-table/format/col/@using != ''">
    col_order_by="<xsl:value-of select="/pivot-table/format/col/@using" />"
  </xsl:if>

  <xsl:if test="/pivot-table/@name != ''">
    table_name="<xsl:value-of select="/pivot-table/@name" />"
  </xsl:if>
  <xsl:if test="/pivot-table/format/summary/@operation != ''">
    operation="<xsl:value-of select="/pivot-table/format/summary/@operation" />"
  </xsl:if>

  <xsl:for-each select="/pivot-table/data/item">
    add_data("<xsl:value-of select="@row" />", "<xsl:value-of select="@col" />", "<xsl:value-of select="@value" />")
  </xsl:for-each>

show_table()

</script>

</body>

</html>

</xsl:template>
</xsl:stylesheet>

