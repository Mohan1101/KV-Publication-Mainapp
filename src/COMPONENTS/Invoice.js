import { Divider } from "@mui/material";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
    Line
} from "@react-pdf/renderer";
// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: "#d11fb6",
        color: "white",
    },
    section: {
        margin: 10,
        padding: 10,
    },
    line: {
        color: "#000",
        width: "2%",
    },
    viewer: {
        width: window.innerWidth, //the pdf viewer will take up all of the width and height
        height: window.innerHeight,
    },
});

// Create Document Component
export default function Invoice() {
    return (
        <PDFViewer style={styles.viewer}>
            {/* Start of the document*/}
            <Document>
                {/*render a single page*/}
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text>Hello</Text>
                        <hr style={styles.line}/>
                    </View>
                    <View style={styles.section}>
                        <Text>World</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
}