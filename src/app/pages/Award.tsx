import axios from "axios"
import { useEffect, useState } from "react"
import Navbar from "../components/navbar"
import { links } from "../assets/data/links"
import {
  Button,
  Card,
  Group,
  NumberInput,
  Paper,
  Text,
  Title,
  Modal,
  Input
} from "@mantine/core"
import { ChevronRight } from "tabler-icons-react"
import { useTimeout } from "@mantine/hooks"
import Combo50table from "../components/table/Combo50table"

type Props = {}

interface IWinner {
  has_winners: boolean;
  counter: number;
}

interface ICurrent {
  title: string;
  foundation: string;
  winner_is: number | null;
  is_closed: boolean;

}


function Award({ }: Props) {
  const [community, setCommunity] = useState<any>([]);
  const [hasWinner, setHasWinner] = useState<IWinner>({
    has_winners: true,
    counter: 0,
  });
  const [currentDraw, setCurrentDraw] = useState<ICurrent | null>(null);

  useEffect(() => {
    axios
      .get("https://api.rifamax.app/draws_fifty_last")
      .then((res) => {
        if (res.data.is_closed === true) {
          console.log("hola mi bro");
        }
        setCurrentDraw(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // useEffect(() => {
  //   useTimeout(() => {
  //     axios.get("https://api.rifamax.app/draws_fifty")
  //     .then((res) => {
  //       setHasWinner({ has_winners: res.data[0].has_winners, counter: hasWinner.counter + 1 })
  //     })
  //   }, 5000)
  // }, [hasWinner.counter])

  useEffect(() => {
    axios.get('https://rifa-max.com/api/v1/riferos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setCommunity(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  const [winningNumber, setWinningNumber] = useState<number | string>("");
  const sendPutRequest = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    axios
      .put(
        "https://api.rifamax.app/draw/status",
        {
          user_id: user.id,
          draw: {
            winner_is: winningNumber,
          },
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW0iOiJyaWZhbWF4Iiwic2VjcmV0IjoiZjJkN2ZhNzE3NmE3NmJiMGY1NDI2ODc4OTU5YzRmNWRjMzVlN2IzMWYxYzE1MjYzNThhMDlmZjkwYWE5YmFlMmU4NTc5NzM2MDYzN2VlODBhZTk1NzE3ZjEzNGEwNmU1NDIzNjc1ZjU4ZDIzZDUwYmI5MGQyNTYwNjkzNDMyOTYiLCJoYXNoX2RhdGUiOiJNb24gTWF5IDI5IDIwMjMgMDg6NTE6NTggR01ULTA0MDAgKFZlbmV6dWVsYSBUaW1lKSJ9.ad-PNZjkjuXalT5rJJw9EN6ZPvj-1a_5iS-2Kv31Kww`
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setWinningNumber("");

      })
      .catch((err) => {
        console.log(err);
      });
  };


  const cerrarDia = () => {
    axios
      .put('https://api.rifamax.app/draw/status', {
        user_id: JSON.parse(localStorage.getItem("user") || '{}').id,
        draw: {
          is_closed: true
        }
      }, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzeXN0ZW0iOiJyaWZhbWF4Iiwic2VjcmV0IjoiZjJkN2ZhNzE3NmE3NmJiMGY1NDI2ODc4OTU5YzRmNWRjMzVlN2IzMWYxYzE1MjYzNThhMDlmZjkwYWE5YmFlMmU4NTc5NzM2MDYzN2VlODBhZTk1NzE3ZjEzNGEwNmU1NDIzNjc1ZjU4ZDIzZDUwYmI5MGQyNTYwNjkzNDMyOTYiLCJoYXNoX2RhdGUiOiJNb24gTWF5IDI5IDIwMjMgMDg6NTE6NTggR01ULTA0MDAgKFZlbmV6dWVsYSBUaW1lKSJ9.ad-PNZjkjuXalT5rJJw9EN6ZPvj-1a_5iS-2Kv31Kww`

        }
      })
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const winnerIs = currentDraw?.winner_is;
  const [openedModal1, setOpenedModal1] = useState(false);
  const [openedModal2, setOpenedModal2] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  let is5050User = false;
  if (typeof user.name === 'string') {
    is5050User = user.name.substring(0, 5) === "50 50 001";
  }

  console.log("Usuario:", user);
  console.log("Es usuario 50 50 001:", is5050User);
  return (
    <>
      <Navbar profiles={community} links={links} />
      
      <Modal
        opened={openedModal1}
        onClose={() => setOpenedModal1(false)}
        size="55%"
        withCloseButton={false}
      >
        <Combo50table />
        <Button mt={10} fullWidth color="red" onClick={cerrarDia}>
          Cerrar día
        </Button>
      </Modal>
  
      <Modal
        opened={openedModal2}
        onClose={() => setOpenedModal2(false)}
        size="55%"
        withCloseButton={false}
      >
        <Combo50table />
      </Modal>
  
      {is5050User ? (
        <Title order={2} fw={500} mb={20}>
          error
        </Title>
      ) : (
      <Card h={880} ml={15} mr={15} mt={15} shadow={"0 0 7px 0 #5f5f5f3d"}>
  
        <>
          <Title order={2} fw={500} mb={20}>
            Premiación 50/50
            <Text fw={300} fz={20} mb={-7}>
              Premiacion para las rifas 50/50
            </Text>
          </Title>
  
          {currentDraw?.winner_is != null && currentDraw?.is_closed === true ? (
            <Group mt={250} position="center">
              <Card w={500} h={190} my={20} shadow="sm" p="lg" radius="md" withBorder>
                <Group position="center">
                  <Title order={2}>
                    El Ticket ganador es :
                  </Title>
                </Group>
  
                <Group mt={15} position="center">
                  <Title order={2}>
                    🎉 {winnerIs} 🎉
                  </Title>
                  {/*modal 2 */}
                  <Button mt={10} onClick={() => setOpenedModal2(true)} fullWidth >
                    Ver cierre
                  </Button>
                </Group>
              </Card>
            </Group>
          ) : (
            <Group mt={250} position="center">
              <Card w={500} h={150} my={20} shadow="sm" p="lg" radius="md" withBorder>
                <Group spacing={0} mt={10}>
                  <NumberInput
                    type="number"
                    placeholder="Numero ganador"
                    value={typeof winningNumber === 'number' ? winningNumber : undefined}
                    w="80%"
                    hideControls
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === ',') {
                        e.preventDefault();
                      }
                    }}
                    onChange={(value) => {
                      if (typeof value === 'number') {
                        setWinningNumber(value);
                      }
                    }}
                    style={{ borderRadius: "5px 0px 0px 5px" }}
                  />
  
                  <Button
                    color="blue"
                    w="20%"
                    style={{ borderRadius: "0px 5px 5px 0px" }}
                    onClick={() => {
                      sendPutRequest();
                      window.location.reload();
                    }}
                    disabled={currentDraw?.winner_is !== null}
                  >
                    <ChevronRight />
                  </Button>
                </Group>
                <Button disabled={currentDraw?.winner_is === null} mt={30} onClick={() => setOpenedModal1(true)} fullWidth color="red">
                  Cerrar día
                </Button>
              </Card>
            </Group>
          )}
        </>
      </Card>
      )}
    </>
  )
  
}

export default Award