--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: google_auths; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.google_auths (
    id bigint NOT NULL,
    refresh_token text,
    access_token text,
    expires_at timestamp(0) without time zone,
    calendar_id character varying(255),
    user_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


--
-- Name: google_auths_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.google_auths_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: google_auths_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.google_auths_id_seq OWNED BY public.google_auths.id;


--
-- Name: invitation_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invitation_tokens (
    id bigint NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp(0) without time zone NOT NULL,
    used_at timestamp(0) without time zone,
    created_by_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


--
-- Name: invitation_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.invitation_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: invitation_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.invitation_tokens_id_seq OWNED BY public.invitation_tokens.id;


--
-- Name: rehearsal_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rehearsal_plans (
    id bigint NOT NULL,
    date date NOT NULL,
    rehearsal_songs character varying(255)[] DEFAULT ARRAY[]::character varying[],
    set_songs character varying(255)[] DEFAULT ARRAY[]::character varying[],
    duration integer,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    scheduled_date date,
    start_time time(0) without time zone,
    end_time time(0) without time zone,
    location character varying(255),
    calendar_event_id character varying(255)
);


--
-- Name: rehearsal_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rehearsal_plans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rehearsal_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rehearsal_plans_id_seq OWNED BY public.rehearsal_plans.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: set_lists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.set_lists (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    total_duration integer,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    date date,
    location character varying(255),
    start_time time(0) without time zone,
    end_time time(0) without time zone,
    calendar_event_id character varying(255)
);


--
-- Name: set_lists_new_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.set_lists_new_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: set_lists_new_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.set_lists_new_id_seq OWNED BY public.set_lists.id;


--
-- Name: sets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sets (
    id bigint NOT NULL,
    set_list_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    songs character varying(255)[] NOT NULL,
    duration integer,
    break_duration integer DEFAULT 0,
    set_order integer NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


--
-- Name: sets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sets_id_seq OWNED BY public.sets.id;


--
-- Name: songs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.songs (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    status character varying(255) NOT NULL,
    notes text,
    band_name character varying(255) NOT NULL,
    duration integer,
    tuning character varying(255) DEFAULT 'standard'::character varying NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    youtube_link character varying(255),
    uuid uuid NOT NULL
);


--
-- Name: songs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.songs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: songs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.songs_id_seq OWNED BY public.songs.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    email public.citext NOT NULL,
    hashed_password character varying(255) NOT NULL,
    confirmed_at timestamp(0) without time zone,
    invitation_token character varying(255),
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    invitation_token_expires_at timestamp with time zone,
    is_admin boolean DEFAULT false NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users_tokens (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    token bytea NOT NULL,
    context character varying(255) NOT NULL,
    sent_to character varying(255),
    inserted_at timestamp(0) without time zone NOT NULL
);


--
-- Name: users_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_tokens_id_seq OWNED BY public.users_tokens.id;


--
-- Name: google_auths id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_auths ALTER COLUMN id SET DEFAULT nextval('public.google_auths_id_seq'::regclass);


--
-- Name: invitation_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation_tokens ALTER COLUMN id SET DEFAULT nextval('public.invitation_tokens_id_seq'::regclass);


--
-- Name: rehearsal_plans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rehearsal_plans ALTER COLUMN id SET DEFAULT nextval('public.rehearsal_plans_id_seq'::regclass);


--
-- Name: set_lists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.set_lists ALTER COLUMN id SET DEFAULT nextval('public.set_lists_new_id_seq'::regclass);


--
-- Name: sets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sets ALTER COLUMN id SET DEFAULT nextval('public.sets_id_seq'::regclass);


--
-- Name: songs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.songs ALTER COLUMN id SET DEFAULT nextval('public.songs_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_tokens ALTER COLUMN id SET DEFAULT nextval('public.users_tokens_id_seq'::regclass);


--
-- Name: google_auths google_auths_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_auths
    ADD CONSTRAINT google_auths_pkey PRIMARY KEY (id);


--
-- Name: invitation_tokens invitation_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation_tokens
    ADD CONSTRAINT invitation_tokens_pkey PRIMARY KEY (id);


--
-- Name: rehearsal_plans rehearsal_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rehearsal_plans
    ADD CONSTRAINT rehearsal_plans_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: set_lists set_lists_new_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.set_lists
    ADD CONSTRAINT set_lists_new_pkey PRIMARY KEY (id);


--
-- Name: sets sets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT sets_pkey PRIMARY KEY (id);


--
-- Name: songs songs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.songs
    ADD CONSTRAINT songs_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_tokens users_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT users_tokens_pkey PRIMARY KEY (id);


--
-- Name: google_auths_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX google_auths_user_id_index ON public.google_auths USING btree (user_id);


--
-- Name: invitation_tokens_created_by_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX invitation_tokens_created_by_id_index ON public.invitation_tokens USING btree (created_by_id);


--
-- Name: invitation_tokens_token_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX invitation_tokens_token_index ON public.invitation_tokens USING btree (token);


--
-- Name: rehearsal_plans_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX rehearsal_plans_date_index ON public.rehearsal_plans USING btree (date);


--
-- Name: sets_set_list_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sets_set_list_id_index ON public.sets USING btree (set_list_id);


--
-- Name: sets_set_list_id_set_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX sets_set_list_id_set_order_index ON public.sets USING btree (set_list_id, set_order);


--
-- Name: sets_set_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sets_set_order_index ON public.sets USING btree (set_order);


--
-- Name: songs_title_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX songs_title_index ON public.songs USING btree (title);


--
-- Name: songs_uuid_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX songs_uuid_index ON public.songs USING btree (uuid);


--
-- Name: users_email_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_index ON public.users USING btree (email);


--
-- Name: users_invitation_token_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_invitation_token_index ON public.users USING btree (invitation_token);


--
-- Name: users_tokens_context_token_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_tokens_context_token_index ON public.users_tokens USING btree (context, token);


--
-- Name: users_tokens_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_tokens_user_id_index ON public.users_tokens USING btree (user_id);


--
-- Name: google_auths google_auths_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_auths
    ADD CONSTRAINT google_auths_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: invitation_tokens invitation_tokens_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invitation_tokens
    ADD CONSTRAINT invitation_tokens_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: sets sets_set_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sets
    ADD CONSTRAINT sets_set_list_id_fkey FOREIGN KEY (set_list_id) REFERENCES public.set_lists(id) ON DELETE CASCADE;


--
-- Name: users_tokens users_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users_tokens
    ADD CONSTRAINT users_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

INSERT INTO public."schema_migrations" (version) VALUES (20240320000000);
INSERT INTO public."schema_migrations" (version) VALUES (20240320000001);
INSERT INTO public."schema_migrations" (version) VALUES (20240321000001);
INSERT INTO public."schema_migrations" (version) VALUES (20240322000001);
INSERT INTO public."schema_migrations" (version) VALUES (20250330124007);
INSERT INTO public."schema_migrations" (version) VALUES (20250404204556);
INSERT INTO public."schema_migrations" (version) VALUES (20250404205338);
INSERT INTO public."schema_migrations" (version) VALUES (20250404210000);
INSERT INTO public."schema_migrations" (version) VALUES (20250407204757);
INSERT INTO public."schema_migrations" (version) VALUES (20250408000000);
INSERT INTO public."schema_migrations" (version) VALUES (20250410134002);
INSERT INTO public."schema_migrations" (version) VALUES (20250414215607);
INSERT INTO public."schema_migrations" (version) VALUES (20250415124434);
INSERT INTO public."schema_migrations" (version) VALUES (20250415191736);
