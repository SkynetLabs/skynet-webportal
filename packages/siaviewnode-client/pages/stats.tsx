/** @jsx jsx */
import { Button, CircularProgress, Container, Typography } from "@material-ui/core";
import axios from "axios";
import { useState } from "react";
import { Box, Flex, jsx } from "theme-ui";

const API_ENDPOINT = process.env.NODE_ENV === "development" ? "http://localhost:4000" : "/api"

type PSeries = {
    'p80-1': number,
    'p95-1': number,
    'p99-1': number,
    'p80-24': number,
    'p95-24': number,
    'p99-24': number,
    'p80-168': number,
    'p95-168': number,
    'p99-168': number,
}

type TSeries = {
    1: number,
    24: number,
    168: number,
    720?: number,
    2160?: number,
}

type Stats = {
    'ttfb': PSeries,
    'download_small': PSeries,
    'download_throughput': PSeries,
    'download_total': TSeries,
    'upload_small': PSeries,
    'upload_throughput': PSeries,
    'upload_total': TSeries,
    'money_spent': TSeries,
    'total_files_pinned': number,
    'total_files_served': TSeries,
}

const Stats = () => {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<Stats>()

    if (loading) {
        axios.get(`${API_ENDPOINT}/stats`)
            .then((response: any) => {
                console.log(response)
                setLoading(false)
                setStats(response.data as Stats)
            }).catch(e => {
                console.log('ERROR:', e)
            })
    }

    return (
        <>
            <Box color="white">
                <Container>
                    <Flex sx={{ alignItems: "center", height: 120 }}>
                        <Box>
                            <Typography sx={{ fontWeight: 700 }}>Sia Skynet</Typography>
                        </Box>
                        <Box sx={{ ml: "auto" }}>
                            <Button href="/stats">
                                Statistics
                            </Button>
                            <Button href="https://sia.tech/" target="_blank">
                                About Sia
                            </Button>
                        </Box>
                    </Flex>
                </Container>
            </Box>
            <Box>
                <Container>
                    <h2>Portal Statistics</h2>

                    <Flex
                        sx={{ height: 400, justifyContent: "center", alignItems: "center" }}
                    >
                        {loading && <CircularProgress />}
                        {!loading &&
                            JSON.stringify(stats)
                        }
                    </Flex>
                </Container>
            </Box>
        </>
    )
}

export default Stats
