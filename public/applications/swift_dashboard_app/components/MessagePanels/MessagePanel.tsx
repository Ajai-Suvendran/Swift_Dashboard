import React, { useState, useEffect } from 'react';
import './MessagePanel.scss';

interface MessagePanelProps {
  message: string;
  title: string;
}

const MessagePanel: React.FC<MessagePanelProps> = ({ message, title }) => {
  const [isXml, setIsXml] = useState<boolean>(false);
  const [formattedMessage, setFormattedMessage] = useState<string>(message);

  useEffect(() => {
    // First, clean up the message and detect if it's XML
    const cleanAndDetectXml = () => {
      let cleanMessage = message;
      
      // Handle common HTML comment wrappers around XML
      if (message.includes('<!--?xml')) {
        cleanMessage = message.replace('<!--?xml', '<?xml');
      }
      if (cleanMessage.includes('--><')) {
        cleanMessage = cleanMessage.replace('--><', '><');
      }
      
      // Check for XML patterns
      const hasXmlIndicators = 
        /^\s*<[\s\S]*>/.test(cleanMessage) || 
        cleanMessage.includes('<?xml') ||
        cleanMessage.includes('<Envelope') ||
        cleanMessage.includes('<Document') ||
        cleanMessage.startsWith('<');
        
      setIsXml(hasXmlIndicators);
      return { cleanMessage, isXml: hasXmlIndicators };
    };
    
    const { cleanMessage, isXml } = cleanAndDetectXml();
    
    if (isXml) {
      try {
        // For XML content, use a different formatting approach
        const formattedXml = prettyPrintXml(cleanMessage);
        setFormattedMessage(formattedXml);
      } catch (error) {
        console.error("Error formatting XML:", error);
        // Fall back to the original message
        setFormattedMessage(cleanMessage);
      }
    } else {
      // For non-XML, just use the clean message
      setFormattedMessage(cleanMessage);
    }
  }, [message]);
  
  // A more robust XML pretty printer using a simpler approach
  const prettyPrintXml = (xml: string): string => {
    // First, decode any HTML entities
    const decodeHtmlEntities = (html: string) => {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    };
    
    try {
      // Try to decode HTML entities first
      const decodedXml = decodeHtmlEntities(xml);
      
      // Create a DOM parser
      const parser = new DOMParser();
      
      // Parse the XML
      const xmlDoc = parser.parseFromString(decodedXml, "text/xml");
      
      // Check if there was a parsing error
      if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        console.warn("XML parsing error, using manual formatting");
        return manualFormatXml(decodedXml);
      }
      
      // Format the XML
      const formattedXml = formatXmlNode(xmlDoc, 0);
      return formattedXml;
    } catch (error) {
      console.error("Error in XML pretty printing:", error);
      return manualFormatXml(xml);
    }
  };
  
  // Format an XML node with proper indentation
  const formatXmlNode = (node: Node, level: number): string => {
    const indent = "  ".repeat(level);
    let result = "";
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      
      // Start of opening tag
      result += `${indent}<${element.nodeName}`;
      
      // Add attributes
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        result += ` ${attr.name}="${attr.value}"`;
      }
      
      // Check if this element has child nodes
      if (element.childNodes.length === 0) {
        result += " />\n"; // Self-closing tag
      } else {
        result += ">\n"; // Close opening tag
        
        // Process child nodes
        for (let i = 0; i < element.childNodes.length; i++) {
          const childNode = element.childNodes[i];
          
          if (childNode.nodeType === Node.TEXT_NODE) {
            const text = childNode.textContent?.trim();
            if (text && text.length > 0) {
              result += `${indent}  ${text}\n`;
            }
          } else {
            result += formatXmlNode(childNode, level + 1);
          }
        }
        
        // Closing tag
        result += `${indent}</${element.nodeName}>\n`;
      }
    } else if (node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      // Process document node's children
      for (let i = 0; i < node.childNodes.length; i++) {
        result += formatXmlNode(node.childNodes[i], level);
      }
    } else if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
      // Handle XML declaration
      result += `${indent}<?${(node as ProcessingInstruction).target} ${(node as ProcessingInstruction).data}?>\n`;
    }
    
    return result;
  };
  
  // Fallback manual XML formatter for when DOM parsing fails
  const manualFormatXml = (xml: string): string => {
    // Replace line breaks and extra spaces
    let formatted = xml.replace(/>\s*</g, ">\n<");
    
    // Use a simple regex-based approach for indentation
    let pad = 0;
    let output = "";
    const lines = formatted.split("\n");
    
    for (let line of lines) {
      let indent = 0;
      
      // Check if this line is a closing tag
      if (line.match(/<\//)) {
        pad -= 1;
      }
      
      indent = pad;
      
      // Add indentation
      output += "  ".repeat(indent) + line + "\n";
      
      // Check if this line is an opening tag and not self-closing
      if (line.match(/<[^/].*[^/]>$/) && !line.match(/<.*\/.*>/)) {
        pad += 1;
      }
    }
    
    return output;
  };

  // Copy XML to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedMessage);
  };

  // Render content with or without XML formatting
  const renderContent = () => {
    if (!isXml) {
      return (
        <div className='messageContainer'>
          <div className='messageToolbar'>
            <button 
              onClick={copyToClipboard}
              className='messageButton'
            >
              Copy Message
            </button>
          </div>
          <pre className='messageContent'>{formattedMessage}</pre>
        </div>
      );
    }

    // Apply syntax highlighting for XML
    let htmlContent = formattedMessage
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    // Highlight element names
    htmlContent = htmlContent.replace(
      /&lt;(\/?)([\w\d.:_-]+)(.*?)(\/?)\&gt;/g, 
      (match, p1, p2, p3, p4) => {
        return `&lt;<span class="xml-tag">${p1}${p2}</span>${p3}${p4}&gt;`;
      }
    );
    
    // Highlight attributes
    htmlContent = htmlContent.replace(
      /(\s+)([\w\d.:_-]+)=(&quot;|&#039;)(.*?)(&quot;|&#039;)/g,
      (match, p1, p2, p3, p4, p5) => {
        return `${p1}<span class="xml-attr">${p2}</span>=<span class="xml-value">${p3}${p4}${p5}</span>`;
      }
    );

    return (
      <div className='xmlContainer'>
        <div className='xmlToolbar'>
          <button 
            onClick={copyToClipboard}
            className='xmlButton'
          >
            Copy XML
          </button>
        </div>
        <pre 
          className='xmlContent'
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  };

  return (
    <div className='messagePanel'>
      <h2 className='messageTitle'>
        {title}
        {isXml && <span className='xmlBadge'>ISO20022 XML</span>}
      </h2>
      <div className='messageWrapper'>
        {renderContent()}
      </div>
    </div>
  );
};

export default MessagePanel;