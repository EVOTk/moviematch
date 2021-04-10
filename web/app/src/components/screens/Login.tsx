import React, { useContext, useState } from "react";
import styles from "./Login.module.css";
import { Field } from "../molecules/Field";
import { Button } from "../atoms/Button";
import { ButtonContainer } from "../layout/ButtonContainer";
import { getPlexCredentials } from "../../api/plex_tv";
import { MovieMatchContext } from "../../store";
import type { ScreenProps } from "../layout/Screen";
import { Layout } from "../layout/Layout";
import { Tr } from "../atoms/Tr";

export const LoginScreen = ({ navigate, dispatch }: ScreenProps) => {
  const { client, config, translations } = useContext(MovieMatchContext);
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("userName"),
  );
  const [userNameError, setUserNameError] = useState<string | undefined>();

  return (
    <Layout>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Field
          label={<Tr name="LOGIN_NAME" />}
          name="given-name"
          autoComplete="given-name"
          value={userName ?? ""}
          onChange={(e) => {
            const userName = e.target.value;
            setUserName(userName);
            localStorage.setItem("userName", userName);
          }}
          errorMessage={userNameError}
        />

        <ButtonContainer paddingTop="s7">
          {!config?.requirePlexLogin && (
            <Button
              appearance="Primary"
              onPress={async () => {
                if (!userName) {
                  setUserNameError(translations?.FIELD_REQUIRED_ERROR!);
                  return;
                }
                dispatch({ type: "setUser", payload: { userName } });
                await client.login({
                  userName,
                });
                navigate({ path: "join" });
              }}
              testHandle="login-anonymous"
            >
              <Tr name="LOGIN_SIGN_IN" />
            </Button>
          )}
          <Button
            appearance="Primary"
            color="plex-color"
            highlightColor="plex-highlight-color"
            testHandle="login-plex"
            onPress={async () => {
              if (!userName) {
                setUserNameError(translations?.FIELD_REQUIRED_ERROR!);
                return;
              }
              const plexAuth = await getPlexCredentials();

              if (plexAuth) {
                await client.login({
                  userName,
                  plexAuth,
                });

                navigate({ path: "join" });
              }
            }}
          >
            <Tr name="LOGIN_SIGN_IN_PLEX" />
          </Button>
        </ButtonContainer>
      </form>
    </Layout>
  );
};